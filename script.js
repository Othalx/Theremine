(function() {
    // Set up the context for the Web Audio API
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Add placeholders for generated oscillator and gain node
    var points = [];

    // Save a reference to the canvas and get its context
    var canvas = document.getElementById("theremin");
    var canvasContext = canvas.getContext("2d");
    
    // Keep canvas dimensions matching the window
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Kick off drawing process
    draw();

    // Draw each point to the canvas
    function draw() {
        requestAnimationFrame(draw);

        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        for(var i = 0; i < points.length; i++) {
            points[i].draw();
        }
    }

    // Match the canvas to the window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Act on mouse click down
    function mouseStart(e) {
        e.preventDefault();

        var point = new Point(e, audioContext, canvas);
        points.push(point);
    }
    
    // Act on touch down
    function touchStart(e) {
        e.preventDefault();

        for (var i = 0; i < e.changedTouches.length; i++) {
            var point = new Point(e.changedTouches[i], audioContext, canvas);

            points.push(point);
        }
    }

    // Act on mouse move when clicked
    function mouseMove(e) {
        e.preventDefault();

        var pos = getPos(undefined);
        
        if(pos !== null) {
            points[pos].update(e);
        }
    }

    // Act on touch move
    function touchMove(e) {
        e.preventDefault();

        for (var i = 0; i < e.changedTouches.length; i++) {
            var pos = getPos(e.changedTouches[i].identifier);
            
            if(pos !== null) {
                points[pos].update(e.changedTouches[i]);
            }
        }
    }

    // Act on mouse click up
    function mouseEnd(e) {
        e.preventDefault();

        var pos = getPos(undefined);
        
        if(pos !== null) {
            points[pos].stop();
            points.splice(pos, 1);
        }
    }

    // Act on touch up
    function touchEnd(e) {
        e.preventDefault();

        for (var i = 0; i < e.changedTouches.length; i++) {
            var pos = getPos(e.changedTouches[i].identifier);
            
            if(pos !== null) {
                points[pos].stop();
                points.splice(pos, 1);
            }
        }
    }

    // Get the position in the points array
    function getPos(id) {
        for (var i = 0; i < points.length; i++) {
            if (points[i].getIdentifier() == id) {
                return i;
            }
        }

        return null;
    }

    // Add event listeners
    canvas.addEventListener('mousedown', mouseStart);
    canvas.addEventListener('touchstart', touchStart);
    canvas.addEventListener('mouseup', mouseEnd);
    canvas.addEventListener('mouseout', mouseEnd);
    canvas.addEventListener('touchend', touchEnd);
    canvas.addEventListener('touchcancel', touchEnd);
    canvas.addEventListener('mousemove', mouseMove);
    canvas.addEventListener('touchmove', touchMove);
})();
