---
layout: post
title: Odds and Ends
---

For some reason I have a lot of things on my mind this morning. It's pretty
cluttered!

## Symmetric matrices

I started working on the [informs thing](http://github.com/jesusabdullah/informs)
last night, and instead of actually Getting Shit Done, so to speak, I got stuck
on this issue of smartly dealing with 
[symmetric matrices](http://en.wikipedia.org/wiki/Symmetric_matrix). Basically,
as far as I can tell, nobody has really bothered to do anything with this. My
thinking is, if you know that A_i_j = A_j_i, then why bother storing A_j_i ? A
real conondrum.

After messing with it for a while though, I didn't bother really
doing anything about it either. This is because I wanted something that looked
and acted like a 
[numpy array](http://docs.scipy.org/doc/numpy/reference/generated/numpy.ndarray.html#numpy.ndarray)
but knew it was symmetric underneath the surface. Couldn't really figure that
one out though. Nyoro~n

## Scipy 2010

Which reminds me! I'm going to the [SciPy 2010 conference](http://conference.scipy.org/scipy2010/)
in about a week! EXCITING

The reality of having to travel somewhere exotic (Austin is exotic shut up)
hasn't really hit me yet though. That, and I'm probably gonna be in way over my
head as far as relative skill levels goes. But hey, hopefully it'll be fun!

## CATamorphism lol

Not that I know what catamorphism means. But since Pete Krumins can 
[explain polymorphisms in C++](http://www.catonmat.net/blog/cpp-polymorphism),
maybe he does. Unfortunately, I think 
[Proggit kinda missed the point](http://www.reddit.com/r/programming/comments/cgckf/the_four_polymorphisms_in_c/).
When I read the article, I got the feeling that it was more about What 
Polymorphism Is, and how it relates to something you may already know from C++.
I think Proggit, on the other hand, was like, "But we already *know* C++!"
Silly peeps. I'm probably biased though, since I chat with pkrumins on irc from
time to time.

## gmsh

On a completely different note, I started using [gmsh](http://www.geuz.org/gmsh/)
with my research. Or, well, trying. I'm starting to think that there's no such
thing as a "good" FEM solution, and that you really just end up trading one
obnoxious quality for another. For example, COMSOL 3.5a is HORRIBLE for scripting.
I mean, just horrible. It's so bad that I tried to get [Sikuli](http://groups.csail.mit.edu/uid/sikuli/)
running so that I could automate a gui build process. ( Unfortunately, Sukuli is
still pretty tempermental in linux, especially for 64-bit. Makes me sad, because
Sikuli looks rad. I guess I'll have to leave it to those Mac users. )

In contrast, gmsh is fairly easy to script up, though it does take a while to
get the hang of it. The gui is handy, but it's like Dreamweaver in that you
really want to switch back and forth between the gui and scripting. Also, the
examples are all old, from a time when gmsh had a pretty different syntax.

The big thing I've noticed with gmsh though is that it doesn't seem to fail
gracefully. My 
[current model](http://www.flickr.com/photos/jesusabdullah/4704833342/sizes/l/)
has some scaling issues, and while comsol also had issues with characteristic
length oddities, it was also able to fail at meshing without dragging the rest
of the computer with it. I mean, it would segfault on a problem solve all the
time, but at least I could write a 
[crappy supervisor script](http://github.com/jesusabdullah/anisotropy/blob/master/fea/babbysitter.sh)
to restart it. For the record, I have a list of more supervisors to try out
in the future. I don't know why, but my google-fu was failing me when I went
looking for them before.

## Old Things:

I have some older odds-and-ends on my [old web page](http://modzer0.cs.uaf.edu/~jesusabdullah)
that I'm not dragging along with me, and the OLD STUFF sidebar is kinda
dumb so I'm gonna type about it here and then feature things I think maybe
actually deserve to be featured, if I care to.

First: [Exam II from Industrial Processes](http://modzer0.cs.uaf.edu/~jesusabdullah/indie-p).
I had a Hell of a time with that course. I thought it was really boring, to be
honest, and, I mean, I like Making Stuff. That wasn't the issue. I really can't
do rote memorization of the parts names of machine X that I've never seen/used
though, nor do I really want to spend too long talking about the importance of
hardness in tool selection. I mean, yeah, that's important (because soft tools
get pwned by hard materials), and I get that, but the course was a lot like a
more useless version of high school biology to me (and I didn't like vocab then
either---one time I didn't look up anything when doing a vocab assignment and
wrote that a gestation period == digestation period. Got some laughs from the
teacher and some embarrassment for myself. GOOD TIMES) and, tbh, I was going
through Hell with my personal life right around the same time. So I was kinda
hosed. I tried to study. I really did. But it's hard when you don't care about
anything and don't like the material anyway.

So what did I do? Well, I was a total dick and smartass about it, as maybe you
can see. My classmates thought it was the funniest thing, and thought the
rest of the internet would like it too. I'm less sure.

Second: [Matrix solving in Excel.](http://modzer0.cs.uaf.edu/~jesusabdullah/matrix_example.xls)
Engineers loove Excel and hate MATLAB. So, I explored the possibilities once. I
don't even really remember what this particular example has. I think it might
be two examples---one which uses matrix inversion, and another which uses a least
squares goalseek algorithm.

Third: [I tried doing interactive fiction once](http://modzer0.cs.uaf.edu/~jesusabdullah/images/interfict/)
on some [forums I used to frequent](http://forums.comicgenesis.com/viewforum.php?f=4).
Of course, enthusiasm sputtered out pretty quickly.

## Webcomics

Speaking of ComicGenesis, [I drew this webcomic in high school](http://wholesomecoolness.comicgenesis.com).
It was a good learning experience, but like most high school projects it's
pretty embarrassing now. Still, some people seem to extract lulz from it.

Which reminds me: [Jekyll](http://wiki.github.com/mojombo/jekyll/) and 
[autokeen](http://gear.comicgenesis.com/cadet/UnderstandingAutoKeen.html)
have a lot in common. Well, except that Jekyll has more features and is
blog-oriented instead of comics-oriented. I think Jekyll could totally be
modified to be more comics-friendly though! Just an idea.
