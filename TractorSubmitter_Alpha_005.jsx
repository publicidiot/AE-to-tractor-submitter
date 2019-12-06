/*

Spool After Effects job to Pixar's Tractor render manager

Author: J Griffin
        www.jgriffin.org
        
Built For:  Awesome Incorporated
            www.awesomeincorporated.com
            
Version:  Alpha 005

*/

// build simple UI
    var myWindow = new Window("dialog", "AE to Tractor. Version A.005 - 'Minimum Viable Product'", undefined);
        myWindow.orientation = "row";
    var groupOne = myWindow.add("group", undefined, "GroupOne");
        groupOne.add("image", undefined, "/Applications/Pixar/Tractor-2.3/lib/website/tv/images/trlogo128.png");
    var groupTwo = myWindow.add("group", undefined, "GroupTwo");
        groupTwo.orientation = "column";
        groupTwo.add("statictext", undefined, "Current limitations: \n\n No 3rd party plugins or scripts are installed on render farm nodes.\n This does not utilize Media Encoder so AE 2018 and up will not render to h.264 \n\n What to expect: \n\nThe entire contents of your render queue will be sent to the farm for rendering, even if the 'Render' box is unchecked.  Make sure all of your render settings and paths are correct before submitting. \n\n AEP project must be saved before submitting.", {multiline:true});
        submitBtn = groupTwo.add("button", undefined, "All good.  Send This To The Farm!");
        cancelBtn = groupTwo.add("button", undefined, "Wait!  Cancel this and let me check.", {name:'cancel'});
        submitBtn.onClick = spoolTractorJob;

    myWindow.center();
    myWindow.show();


function getAEbinPath(){
	var binPath;
	var versionString = "";
	var suiteString = "CC";
	
	// get the version of after effects and divide it into major and minor
	var appVersion = app.version; // returns current version of AE
	var versionItems = appVersion.split(".")

	// ASSUMES VERSION NUMBER INCREMENTS WITH YEAR - CHECK THIS WITH EVERY ADOBE UPDATE!
    var versionNum = parseInt(versionItems[0]) + 2003;
    versionString = " " + versionNum;
	
	//build path to aerender binary
	if (versionNum < 17) {
		binPath = "/Applications/Adobe After Effects " + suiteString + versionString + "/aerender";
		}
	else {
		binPath = "/Applications/Adobe After Effects" + versionString + "/aerender";
		}
	return binPath;
}

// write new Alf file with render specs and spool to Tractor
function spoolTractorJob(){
    var randomNum = Math.floor(Math.random() * 1000); //generate random number for alf file to ensure no duplicate names.
    
    var dirtyProj = app.project.file.toString();
    var currentProj = dirtyProj.replace(/%20/g, " "); //replace %20 with spaces for entire string.
    var pathItems = currentProj.split("/");  //splits project path at "/" 
    var projName = pathItems[pathItems.length - 1].split(".")[0];  //returns current project name, no extension
        pathItems.pop();  //removes last item from pathItems
    var alfPath = ("/Volumes"+(pathItems.join("/"))+"/renderData/Tractor/");
    var alfFile = (alfPath+projName+randomNum+".alf");
    var shellAlfPath = alfPath.replace(/ /g, "\\ ");
        system.callSystem("mkdir -p "+shellAlfPath);
    var shellAlfFile = alfFile.replace(/ /g, "\\ "); //format path so that javascript can properly use it in a shell command.
    
    var alfWrite = new File (alfFile); //create empty .alf file
	//content to be written to empty .alf file.  This is super basic but it works.  Need a much better way to do this.
    var content = "Job -title {"+projName+"} -priority {10} -subtasks {Task -title {"+projName+"} -cmds {RemoteCmd {{"+getAEbinPath()+"} {-project} {"+currentProj+"}} -service {AERender}}}"
;
    alfWrite.open ("w");
    alfWrite.write(content);
    alfWrite.close();
    
    var tractorSpool = "/Applications/Pixar/Tractor-2.3/bin/tractor-spool "; // set path to tractor-spool binary. Need a smarter way to do this.
    var submitJob = system.callSystem (tractorSpool+" "+shellAlfFile); //
    alert(submitJob);
    myWindow.close();
}
