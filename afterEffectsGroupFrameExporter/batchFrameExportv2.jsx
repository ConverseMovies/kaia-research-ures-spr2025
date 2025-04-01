(function () {
    var comp = app.project.activeItem;  // Get the active composition
    //Check if Composition is Selected
    if (comp && comp instanceof CompItem) {

        //Check if Custom Output is available
        var templateName = "Custom Output";
        var rq = app.project.renderQueue;

        var tempItem = rq.items.add(comp);
        var templates = tempItem.outputModule(1).templates;
        var found = false;
        for (var i = 0; i < templates.length; i++) {
            if (templates[i] == templateName){
                found = true;
                break;
            }
        }
        tempItem.remove();
    
        if (!found) {
            alert("IMPORTANT: No template named 'Custom Output' was found. Please create a custom render template named 'Custom Output' with your desired output settings and try again.");
            return;
        }

        //Filename Selection
        // Prompt user for base filename
        var baseFileName = prompt("Enter the base file name for your exports:", "URES_20250304-24cam");
    
        // If user cancels the prompt or doesn't enter anything, exit the script
        if (!baseFileName) {
            alert("Script cancelled. No filename was provided.");
            return;
        }
        
        // Select output folder
        var outputFolder = Folder.selectDialog("Select output folder for frames");

        //Start dialog functionality
        if (outputFolder) {
            // Store original layer visibility states before making any changes
            var originalLayerStates = [];
            for (var j = 1; j <= comp.numLayers; j++) {
                originalLayerStates.push(comp.layer(j).enabled);
            }
            
            try {
                app.beginUndoGroup("Export Frames");  // Begin undo group

                // Clear existing render queue
                while (app.project.renderQueue.numItems > 0) {
                    app.project.renderQueue.item(1).remove();
                }

                //Loop through all layers
                for (var i = 1; i <= comp.numLayers; i++) {
                    // First disable all layers
                    for (var j = 1; j <= comp.numLayers; j++) {
                        comp.layer(j).enabled = false;
                    }
                    
                    // Enable only current layer
                    comp.layer(i).enabled = true;
                
                    //Add layer to render queue
                    var renderItem = rq.items.add(comp);

                    // Configure output module
                    var outputModule = renderItem.outputModule(1);

                    //Select Template
                    outputModule.applyTemplate(templateName);

                    // Set output file path with proper naming convention - using .png extension
                    var outputPath = outputFolder.fsName + "/" + baseFileName + "_" + String.fromCharCode(i + 64) + "_[###].png";
                    outputModule.file = new File(outputPath);
                }

                // Restore original layer visibility
                for (var j = 1; j <= comp.numLayers; j++) {
                    comp.layer(j).enabled = originalLayerStates[j-1];
                }

                // Inform user
                alert("All layers have been added to the render queue. Press OK to start rendering.");

                //Render Layers
                if (app.project.renderQueue.numItems > 0) {
                    app.project.renderQueue.render();
                    alert("All layers have been rendered as sequences.");
                }
            } finally {
                app.endUndoGroup();  // End undo group, even if there was an error
            }
        }
    }
    else {
        alert("Please Select a Composition");
    }
})();