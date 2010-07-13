---
layout: post
title: Parallolism
---

As I finally got most of my ducks in a row for running my calculations for my thesis, it occured to me just how crazy my dataflow is. I think it's worth sharing.

So, for my thesis, I'm running through a set of roughly 500-1000 simulations of a [needle probe](http://en.wikipedia.org/wiki/Soil_thermal_properties) in [anisotropic](http://en.wikipedia.org/wiki/Anisotropy) snow. For these simulations, I'm using [COMSOL](http://www.comsol.com/), scripted with [matlab](http://www.mathworks.com/products/matlab/) and COMSOL 3.5a's [comsol/matlab interface](http://ircs.seas.harvard.edu/display/USERDOCS/How+to+run+Comsol+interactively,+or+using+SGE).

Now: While numerical simulations are considered "cheap" by today's computing standards, each of these simulations takes a non-trivial amount of time. Each simulation probably takes ~10 minutes, not including meshing (which is actually relatively quick). This means that the total run-time for the sims, in series, is somewhere between 2 days and a week.

Based on experience, this is being fairly optimistic.

So, there was clearly good reason to try to somewhat parallelize the process.  I have a number of workstations at my disposal, so I decided to spread out my sims across the six of them that are in the closest computer lab. But how would I split them up? Surely not by-hand, right?

My first thought was to try and pick up a mapreduce framework, such as the pretty sweet-sounding [disco](http://discoproject.org/) or the lightweight-sounding [bashreduce](http://github.com/jweslley/bashreduce). Unfortunately for bashreduce, it requires a particularly archaic version of netcat (that is, the original version) to operate correctly, and I didn't feel like trying to figure it out. Disco, on the other hand, felt nice for a python project, but maybe not quite right for what I needed. While I wanted to do something mapreduce-esque, I was dealing with what I thought was a particularly unusual situation:

* I was wanting to run parallel instances of **comsol matlab**. This means that any messages or data I wanted to pass along to my sims had to be in a way that matlab could handle.  Unfortunately, matlab doesn't really have a good way (that I know of) to read stdin (something I've considered hacking into [methlabs](http://www.github.com/jesusabdullah/methlabs), but that's for another time). 

* The networking situation with the ARSCputers is all sorts of screwy.  In order to ssh into them, you have to be in a [kshell](http://www.afrl.hpc.mil/customer/userdocs/kerberos/man/kshell.html) and using the DoD's particular brand of OpenSSH and [krb5](http://en.wikipedia.org/wiki/Kerberos_(protocol)). While it might be workable, I never had good luck using, say, scp, with the ARSCputers, and all sorts of things like to not work as one would expect. Oh well, at least ssh is "passwordless" once I have my krb5 ticket (which requires a password).

So, rather than make an existing and awesome solution work for me, I decided to write a bunch of clunky scripts to do it myself, rocking the ["diy concurrency" that David Beazley discussed](http://jesusabdullah.github.com/2010/06/30/day3.html).

It's a site to behold, and obnoxiously convoluted, so I drew this picture:

![](http://farm5.static.flickr.com/4141/4788254709_c469f04418_z.jpg)

([flickr](http://www.flickr.com/photos/jesusabdullah/4788254709/))

Follow along now:  I wrote a python script that splits up the angles into relatively even sets of jobs for the ARSCputers to crunch. I then have the python script run commands over ssh--something like, "ssh mallard $SCRATCH/anisotropy/foreman.sh '[0, 60]'"--about six times, once for each computer running sims.

From there, the called shell script runs comsol matlab.

First, for each angle, comsol matlab generates a mesh. Then, it re-uses each mesh roughly fifty times, each time running a simulation on a different thermal conductivity matrix. *symmetric_tocell.m* (I accidentally copied "fromcell" into the picture) is used to convert the supplied conductivity matrix into a format which comsol prefers. The results of these simulations are sets of (time,temperature) data.

This is where I'm still figuring things out a little bit, so bear with me.

These time series data will need to be boiled down into conductivity measurements, based on their slopes at non-transient points in time. For this, I plan to use more python, since scipy has a nice Lagrange polynomial function that matlab seemingly lacks. In this case, I'll probably use something like [pythoncall](http://github.com/pv/pythoncall) or [pymex](http://github.com/kw/pymex) for more easier embeddings.

Once this information is properly boiled down, it needs to be compiled. The first step of this is merely to dump the results, in the form of .mat files (hdf5 in disguise, from what I understand), into a .tar file on the ARSC storage archive. Hopefully it doesn't get too busy! :v SORRY ARSC Alternately, I might decide to be a REAL [maverick](http://www.urbandictionary.com/define.php?term=maverick) and somehow get the computer to email the data to me or something. XD

Finally, once everything is done running, I should be able to "reduce" the datasets in MATLAB relatively easily, since they'll be two-dimensional datasets sliced along the third dimension that is "angle."

So then the question becomes, "then what?" Well? I don't know yet.
