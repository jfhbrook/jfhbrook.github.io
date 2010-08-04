---
layout: post
title: Node.js the Process Supervision Framework
---

While working on my [stupid thesis](http://github.com/jesusabdullah/anisotropy) (I take it back you're not stupid thesis come back), I came to the point where I needed something to watch my *comsol matlab* jobs because, man, they really like to segfault five minutes after I stop watching them. (The other problem is keeping track of what I've already solved, but, whatever).

Anyway, because the fedora install on the workstations is [so fucking stale](http://docs.fedoraproject.org/en-US/Fedora/7/html/Release_Notes/index.html) and is so scarce when it comes to available libraries, pretty much [none](http://cr.yp.to/daemontools.html) of the [process](http://upstart.ubuntu.com/) supervision [frameworks](http://supervisord.org/) I tried were willing to install.

So, I figured, why not try to write one in Node? Javascript's fairly easy to get a leg up on, and Node is surprisingly portable. I hadn't had it fail to compile yet, and you can dump modules pretty much anywhere you want, so here I was thinking, maybe a few days, and I'll have a serviceable [supervise clone](http://cr.yp.to/daemontools/supervise.html).

As it turns out, node has awesome tools for this. In particular, it has the "process" object, both in the global form (which refers to the running Node instance) and in the spawned child form (referring to the child process), and has a whole bunch of awesome methods and properties:

* process.stdin, process.stdout, and process.stderr are readable/writeable streams *with events for when something happens on them!*  
* process.pid is the process ID of the process.  
* process.argv is an array containing all the args passed to the process.  
* process.kill(signal) lets you send a kill signal to the process.  
* process.cwd returns the current directory of the process.  
* process.chdir() lets you change directory.  

Surprising even for Node, it turns out that writing any sort of process supervision is almost *trivial*. For example, this is my *supervise* clone **in its entirety:**

    #!/usr/bin/env node

    var babyMaker = require('child_process').spawn;
    var fs = require('fs');

    //change directory to one supplied in argument
    try {
        process.chdir(process.argv[2]);
    } catch (err) {
        console.log('While changing directories: ' + err);
        process.exit(1);
    }

    //attempt to run ./run if it exists
    try {
        var babby = babyMaker('./run');
        var restart = false;

        babby.stdout.on('data', function (data) {
            console.log('stdout: ' + data);
        });

        babby.stderr.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        babby.on('exit', function (code) {
            restart = true;
        });

        //restart babby if needed
        setInterval( function() {
            fs.readdir('.', function(err, files) {
                if (files.indexOf('down') >= 0) {
                    console.log("File `down' exists; Exiting successfully.");
                    process.exit();
                } else {
                    if (restart) {
                        console.log("Restarting process...");
                        babby = babyMaker('./run');
                        restart = false;
                    }
                }
            });
        }, 2000);

    } catch (err) {
        console.log('While attempting to start process: ' + err);
        process.exit(1);
    }

It only took me an hour to write this down.

The tools Node supplies for managing processes makes it really easy to not merely create yet another process supervision framework, but to write your own ad-hoc process supervisor. In other words, Node *supplies the framework*.

SO COOL

Now I just have to get Node running on the ARSC workstations, and wouldn't you know it---fucker fails to build. I guess I'm sticking to my crummy bash script for now!
