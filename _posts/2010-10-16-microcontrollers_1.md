---
layout: post
title: "Starting Out with Microcontrollers, Pt. 1: What Do You Need?"
---

For my research, I reached a point where it became clear that an existing datalogger wouldn't cut the mustard. I needed to read data off a digital compass sensor in addition to a 3-way analog accelerometer and a thermistor, and most dataloggers give you analog-only connections and make programming nearly impossible, and still charge $5000 apiece.

After lots of talking to various people, I chose to use an [MSP430-series](http://www.ti.com/msp430) microprocessor (made by TI) to interface with my sensors. I considered the arduino, but the MSP430s (unlike the arduino) can speak [I2C](http://www.i2c-bus.org/) and some other interface my compass *doesn't* speak--[SPI perhaps](http://en.wikipedia.org/wiki/Serial_Peripheral_Interface_Bus)--at the hardware level, which is pretty cool. Plus, it's the go-to platform at the electrical engineering department at my school, so I've been able to get lots of support. In addition, I'm trying to attend micromouse meetings. I figure it'll be a mutually beneficial relationship:  I'll learn to program msp430 microcontrollers, and in return I can help with some mapping algorithms or something. We'll see.

It seems to me that a lot of microprocessor stuff out there, aside from the arduino, assume you've done something like it before. Well, I haven't. So, I figured I'd write up some of the things I've learned so far. I still have a long way to go--I've only managed to get an LED to blink at present--but I'll expand on my learnings in later bloggings.

##What You'll Need:

###A Header Board.

I bought something [a lot like this](http://www.olimex.com/dev/msp-h1611.html).  As you can see from [this schematic](http://www.olimex.com/dev/images/msp430-hxxx-sch.gif), they basically just extend the pins on the little microprocessor chip so you can get to them, and add a JTAG connector (for your computer--I'll get to that) and a clock. Really, there isn't much going on outside the chip itself, so most of your manufacturer-supplied resources are going to come directly from the chip manufacturer, TI.

###TI's Docs for your particular chip.

TI has extensive technical documents on each of their msp430 chips. In fact, they almost tell you *too much*, confusing small-brained engineers like myself. Still, TI's docs are the go-to source for when you start asking, "which pin does what?"

###A Programmer.

The programmer is basically a box that takes programs from your computer (over USB) and dumps them onto the proper locations on the microcontroller (mine uses a JTAG interface). These also often allow you to do debugging on your microcontroller as well, so they're often also called debuggers. [TI sells one](http://focus.ti.com/docs/toolsw/folders/print/msp-fet430uif.html), and I bought it because I wanted to make sure it would work in linux, but there are many competitors. My understanding is that it's worth it to pay a bit more for quality reasons.

One thing worth noting is that, since the devices use flash memory, your microcontroller's memory lifetime is directly proportional to frequency of reprogramming. You should get plenty of reprogrammings in over a reasonable lifetime for your microcontroller, but you probably want to avoid extraneous reprogrammings.

###A compiler.

There are a few ways to go with this.  TI has a free compiler/ide, called Kickstart, for small-ish projects on Windows.  There is also a usable gcc toolchain. The department uses an IDE/compiler suite called [Crossworks](http://www.rowley.co.uk/) that costs money, but is also pretty nice and runs on linux (unlike TI's kickstart).  I chose Crossworks because I have money and my resources are most familiar with it, but at $250 clearly it's not the best fit for everyone. Chances are, I will eventually give the gcc toolchain a shot.

Crossworks is relatively straightforward, once everything's installed and going.  You open a "Project," write your code, mash "compile" and then "load onto device," and you're good to go. Of course, your experience may vary.

### (Optional) A C reference.

Most microcontrollers are programmed in C or assembly. C is a good choice for most of us, I think.  Programming for microcontrollers is different than for larger systems when using C, so while I think past C knowledge would be helpful, you're not really hosed if you suck at C systems programming either.  In fact, I've found that knowing a smattering of javascript has been quite helpful so far. Still, having access to references is probably a good thing.  Note: while I have a borrowed copy of K&R hanging around the apartment, I don't suspect that I'll need it, and that The Internet will be sufficient for most of my questions.

### Things to hook to your microcontroller.

* LEDs
* Sensors
* Switches

## What next?

Given time, I hope to write up my experiences with the programming itself, based on me learning to blink an LED.
