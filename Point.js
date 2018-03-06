function Point(point, audioContext, canvas) {
    // Capture data about point
    var x = Math.min(Math.max(point.clientX, 0), canvas.width);
    var y = Math.min(Math.max(point.clientY, 0), canvas.height);

    var identifier = point.identifier;
    var canvasContext = canvas.getContext("2d");
    var color = `hsl(${Math.round(Math.random() * 255)}, 100%, 50%)`;

    // Create oscillator node
    var oscillator = audioContext.createOscillator();
    oscillator.frequency.setTargetAtTime(_calculateFrequency(), audioContext.currentTime, 0.01);

    // Create gain node
    var gainNode = audioContext.createGain();
    gainNode.gain.setTargetAtTime(_calculateGain(), audioContext.currentTime, 0.01);

    // Set up analyser
    var audioAnalyser = audioContext.createAnalyser();
    var bufferLength = audioAnalyser.fftSize;

    // Connect together
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.connect(audioAnalyser);

    // Start playing
    oscillator.start(audioContext.currentTime);

    function getIdentifier() {
        return identifier;
    }

    // Update the tone based on point data
    function update(point) {
        x = Math.min(Math.max(point.clientX, 0), canvas.width);
        y = Math.min(Math.max(point.clientY, 0), canvas.height);

        oscillator.frequency.setTargetAtTime(_calculateFrequency(), audioContext.currentTime, 0.01);
        gainNode.gain.setTargetAtTime(_calculateGain(), audioContext.currentTime, 0.01);
    }

    // Stop playing
    function stop() {
        oscillator.stop(audioContext.currentTime);
        oscillator.disconnect();
    }

    // Draw the waveform on the canvas
    function draw() {
        // Get data at current time
        var dataArray = new Uint8Array(bufferLength);
        audioAnalyser.getByteTimeDomainData(dataArray);

        // Style the line
        canvasContext.lineWidth = 3;
        canvasContext.strokeStyle = color;

        // Start the line
        canvasContext.beginPath();

        // Determine the width of each segment
        var sliceWidth = canvas.width / bufferLength;
        
        // Draw the line
        var x = 0;
        for (var i = 0; i < bufferLength; i++) {
            var amplitude = dataArray[i] / 128;
            var y = amplitude * canvas.height / 2;

            if (i === 0) {
                canvasContext.moveTo(x, y);
            } else {
                canvasContext.lineTo(x, y);
            }

            x += sliceWidth;
        }

        // Add glow to line
        canvasContext.shadowColor = color;
        canvasContext.shadowOffsetX = 0;
        canvasContext.shadowOffsetY = 0;
        canvasContext.shadowBlur = 10;

        // Render the line
        canvasContext.stroke();
    };

    // Calculate the frequency based on the window width
    function _calculateFrequency() {
        var minFrequency = 20;
        var maxFrequency = 2000;

        return ((x / canvas.width) * maxFrequency) + minFrequency;
    };

    // Calculate the volume based on the window width
    function _calculateGain() {
        var minGain = 0;
        var maxGain = 1;

        return 1 - ((y / canvas.height) * maxGain) + minGain;
    };

    // Return values for main script
    return {
        getIdentifier: getIdentifier,
        update: update,
        stop: stop,
        draw: draw
    }
}
