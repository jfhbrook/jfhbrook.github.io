---
layout: post
title: 'Representing a Maze in an Embedded System: Some Thoughts'
---

I've started thinking about maze mapping and generation algorithms for
micromouse, and I thought what I came up with was worth sharing.

So, first of all: A representation of a maze, in a computer, is usually going to
come down to *some* form of a
[graph](http://en.wikipedia.org/wiki/Micromouse)--that is, the kind with nodes
(the squares one may stand in) connected by edges (areas without walls). Of
course, for a typical 2-d square maze there are going to be some assumptions we
can make:

1. The graph is bidirectional. That is, if you can go from box 1 to box 2, you
can also go from box 2 back to box 1.

2. The graph is what are called "simple." This means that boxes don't really
have edges connecting to themselves (for example, there's no warp portal that
will take you from box 1 to, umm, box 1), nor are there multiple, equivalent
edges (There aren't two edges that go from box 1 to box 2).

So, for example's sake, suppose we have the following graph:

    [1]-a-[2]  
     | \   |  
     b  c  d  
     |   \ |  
    [3]-e-[4]  

Hopefully, that makes sense. I don't feel like drawing pictures---I've done
enough of that lately.

Based on what I know about graph data structures, there are a few ways to
represent them:

* *A variation of linked lists:* In this case, you have all these variables that
represent your nodes, and each node has links to other nodes you can jump to.
If the links are bidirectional, one needs another link to take them back. Maybe
in JSON, we could encode it like this:

    { 'n1': ['n2', 'n3', 'n4'],  
      'n2': ['n1', 'n4'],  
      'n3': ['n1', 'n4'],  
      'n4': ['n1', 'n2', 'n3'] }  

Keep in mind that, in C(++) land, these links are usually more pointer-esque.

This model makes sense if all you want to do is traverse the tree--You just
start at The Beginning and follow the links all the way down.  On the other
hand, it's harder to ask questions like, "what does link 7 look like?" because,
typically, you have to traverse your way down the list to GET to link 7. So:
Pretty intuitive and awesome in some ways, but not right for what we're doing.

* *Incidence matrix:* Here, you have a matrix that looks something like:

        (1)  (2)  (3)  (4)  
    (a)  1    1    0    0  
    (b)  1    0    1    0  
    (c)  1    0    0    1  
    (d)  0    1    0    1  
    (e)  0    0    1    1  

Basically, your rows represent edges, and your columns represent nodes.  To read
the incidence matrix, you read across a row and see which nodes your edge
connects. For example, row "a" has ones at columns (1) and (2), meaning edge "a"
connects nodes (1) and (2). This can be extended to encode simple loops as well,
though we don't really need to concern ourselves with that for this case since simple
loops shouldn't happen in a maze.

This approach works great if you care as much about your edges as you do your
nodes. However, I think their identities only matter incidentally in terms of
the maze, as it's just getting to other nodes that we care about. Also, its size
is equal to the number of edges times the number of nodes--for an 8x8 maze, that
ends up being (8 x 8) x (2 x 8 x 7) = 7168. That's pretty big (Numerical
wizards: Shush.)!

* *Adjacency Matrix:* This matrix looks more like this:

        (1)  (2)  (3)  (4)  
    (1)  0    1    1    1  
    (2)  1    0    0    1  
    (3)  1    0    0    1  
    (4)  1    1    1    0  

This matrix can be read as, "Does node {row} connect to node {column}?" For
example, if we want to know if there is an edge connecting nodes 2 and 3, we
may check A(2, 3) and see that, in fact, there is no edge. In other words, there
is a wall.

This method, I think, is the right one for our particular problem. First, it
allows us to quickly look up whether a wall exists or not. Second, it can
actually be encoded in a fairly compact manner, even without talking about
sparseness of a matrix, given our initial assumptions:

* The lack of simple loops means that the diagonal is *always* all zeros.
* The bidirectionality of the graph means our matrix is diagonal.

This means that we only actually need to hold the part of the matrix *above*
the diagonal in memory. That is, there are only (n^2 - n)/2 unique elements
we have to be concerned about, a'priori.  For a 8x8 matrix, that's 2016
elements. It's an improvement over the incidence matrix for sure, but can we do
better?

Of course we can.

I began to write down the incidence matrix for a 3x3 "maze" with *no* walls:

    (1)---(2)---(3)  
     |     |     |  
    (4)---(5)---(6)  
     |     |     |  
    (7)---(8)---(9)  

and it looked like this:

                 [R1]          [R2]          [R3]  
          _| (1) (2) (3) | (4) (5) (6) | (7) (8) (9)  
         (1)  0   1   0  |  1   0   0  |  0   0   0  
    [R1] (2)  1   0   1  |  0   1   0  |  0   0   0  
         (3)  0   1   0  |  0   0   1  |  0   0   0  
          ---------------|-------------|-------------  
         (4) (look up &  |  0   1   0  |  1   0   0  
    [R2] (5)   to the    |  1   0   1  |  0   1   0  
         (6)   left!)    |  0   1   0  |  0   0   1  
          ---------------|-------------|-------------  
         (7)  (look in   | (look up &  |  0   1   0  
    [R3] (8) the upper-  |   to the    |  1   0   1  
         (9)   right!)   |   left!)    |  0   1   0  

We can see that the semi-diagonal blocks are identity matrices. In retrospect,
maybe this isn't surprising, since blocks in a row connect to the ones directly
above them.  Of course, the other blocks not on the diagonal are zero matrices,
since, non-adjacent rows do not connect to each other directly. Meanwhile, the 
on-diagonal blocks have an interesting form that in only 3-d is hard to see.

So, let's write down the adjacency matrix for a row of four elements:

    [1]---[2]---[3]---[4]  

        (1)  (2)  (3)  (4)  
    (1)  0    1    0    0  
    (2)  1    0    1    0  
    (3)  0    1    0    1  
    (4)  0    0    1    0  

So, in an interestingly self-similar manner, the block matrices on the diagonal
have ones on their off-diagonals, and zeros everywhere else! *Fascinating*.

Knowing that we have this definite pattern should be able to help us more
efficiently store our graph in memory (keep in mind, memory is at a premium on
a microcontroller). There are two parts to this:  First, there's the question
of *how many slots* do we need for an n*n maze?

First, we know that for an nxn maze, we have nxn block matrices, and that we
only need to encode **(n^2 + n)/2** of those, due to symmetry. For example, for our
3x3 maze we only have 6 independent block matrices to concern ourselves with.
Second, we know that **n** of those matrices are on the diagonal, **(n-1)** of those
are just off the diagonal, and that the rest are zero anyway. So, that means
we only *actually* have to keep track of **2n-1** block matrices in total (5 in the
3x3 case). Moreover, for the diagonal matrices, we have **(n-1)** unique values to
track (due again to symmetry), and for the off-diagonal matrices, we have **n**
unique values. This brings our total number of unique values to
**n(n-1) + (n-1)n**, or **2(n^2 - n)**.  In the case of an 8x8 matrix, this
comes out to 112.

Not bad.

(Incidentally, this is a roundabout way of counting the total number of walls.)

Second, there is figuring out if there is a nice way to translate a 
(row, column) pair in the adjacency matrix into, say, a simple 1-D list of all 
the values that could potentially be 1 from left to
right.  I'll ignore that for now--I already feel like I'm prematurely
optimizing. Plus, typical sparse matrix notation (i, j, value) isn't too bad.
