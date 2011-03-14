---
layout: post
title: The Importance of Cheap Containers
---

I've been hammering out my thesis for the last few weeks, and while writing up
the numerical studies I did, I came across this gem of code:

	%tabulator
	%turns lame structures into some csv action

	%given params:
	%  answers
	%  angles
	%  kxy
	%  kz

	% Bad style, but I'm dealing with a cluttered namespace because I'm not functionalizing these.
	% This is because parameter passing is a pita. So, leave me alone.
	[Kxy, Kz] = meshgrid(kxy, kz);

	fprintf('angle, kxy, kz, kmeas \n');
	for t=1:length(angles),
	    for pt=1:size(Kxy,1)*size(Kxy,2),
		fprintf([ num2str(angles(t)) ', ' num2str(Kxy(pt)) ', ' num2str(Kz(pt)) ', ' num2str(answers{t}{pt}{1}) '\n']);
	    end
	end

The interesting part here is the comment about bad style.

See, there are basically two ways to handle a procedure in MATLAB. The first is
to write a function that returns something:

    % ftoc.m
    function C = ftoc(F)
        C = (5/9)*F-32;
    end

which must be used like this:

    > ftoc(212)
    100

Or, you can write a procedure to manipulate the existing global namespace in
your MATLAB session:

    % ctof.m

    F = (C + 32)*(9/5);

which must be used like this:

    > C = 100
    
        C = 100
    
    > ctof
    > F

        F = 212
    
    >

I think this latter use should be considered Terrible Style in MATLAB. Hell, it
should be considered less-than-desirable *everywhere*. And yet, people do this
sort of thing *all the time* in MATLAB.

Why? Well, I suspect that it has to do with MATLAB's data structures and syntax.
For example, in that particular procedure I wrote, I needed `k_xy`, `k_z`,
`angles` and `answers`, the latter of which was a nested cell array. In fact,
the very reason for this procedure's existence had to do with the inherent
awkwardness that came with trying to do things with `answers` directly.

Now, I don't want to say that this would make everything better, but suppose
that, instead of that mess, we could've written something more like:

    tabulator({ answers: answers,
                kxy: k_xy,
                kz: k_z,
                angles: angles });

Or, even better, what if I simply bundled everything together once, and used the
bundle for *all* my function calls?

    > analyzer(bundle);
        *results*
    > tabulator(bundle);
        *results*

and etcetera? Now, MATLAB *does* have structs. However, in my experience they're
a bit annoying to work with. They're certainly not as easy to use as
javascript's objects or python's dicts.

I would like to put forth the preposition that, in order to keep clean code for
scientific computing uses, especially in the REPL as is done with MATLAB, that
it is critical to have some sort of quick, easy, cheap bundling tool, like
javascript's object or python's dictionary.

I'd expound on this some more, but I'd better get back to work. My graduation is
at stake!
