Very basic After Effects script to submit render jobs to Pixar's Tractor render manager.  

Requirements:  
MacOS 10.10 or higher.
After Effects CC 2018 or higher.
Pixar Tractor 2.0 or higher.

Usage:  
Place in After Effects scripts folder - /Applications/Adobe After Effects CC [version]/Scripts  
Script will be available from the AE menubar File -> Scripts at next launch.

Launch the script from the menubar File -> Scripts and you'll be presented with a window with a brief description of the script's current function and limitations.

All queued jobs in the AE render queue will be submitted to Tractor for rendering.  
Set up your render queue as desired and save your AE project prior to running the script.

This script does not (yet) distribute frames across multiple machines.  It simply takes whatever is in the render queue and hands it to a single machine on your render farm.  Like I said above, it's very basic.
