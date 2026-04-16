runAfterLoad(() => {

    // =========================
    // ROBOT HEAD
    // =========================
    elements.robot_head = {
        color: "#8a8a8a",
        behavior: behaviors.WALL,
        category: "machines",
        state: "solid",
        density: 3000,

        tick(pixel) {
            let x = pixel.x;
            let y = pixel.y;

            // search area around robot
            const dirs = [
                [1,0], [-1,0], [0,1], [0,-1],
                [1,1], [-1,1], [1,-1], [-1,-1]
            ];

            for (let d of dirs) {
                let nx = x + d[0];
                let ny = y + d[1];
                let target = getPixel(nx, ny);

                if (!target) continue;

                // =========================
                // EAT IRON
                // =========================
                if (target.element === "iron") {
                    deletePixel(nx, ny);

                    // grow robot body
                    createPixel("additioned_iron", x, y + 1);
                }

                // =========================
                // DRINK OIL (survival)
                // =========================
                if (target.element === "oil") {
                    // oil consumed = energy boost (simple survival logic)
                    deletePixel(nx, ny);
                    pixel.color = "#b0b0b0"; // slightly “energized”
                }
            }

            // simple wandering movement
            let mx = x + r([-1, 0, 1]);
            let my = y + r([-1, 0, 1]);

            if (isEmpty(mx, my)) {
                swapPixels(x, y, mx, my);
            }
        }
    };


    // =========================
    // ROBOT BODY (base 2nd pixel)
    // =========================
    elements.robot_body = {
        color: "#6f6f6f",
        behavior: behaviors.STURDYPOWDER,
        category: "machines",
        state: "solid",
        density: 4000
    };


    // =========================
    // GROWTH PIXEL (iron-based expansion)
    // =========================
    elements.additioned_iron = {
        color: "#9a9a9a",
        behavior: behaviors.WALL,
        category: "machines",
        state: "solid",
        density: 5000,

        tick(pixel) {
            // slowly try to attach itself to robot structure
            let dirs = [[1,0],[-1,0],[0,1],[0,-1]];

            for (let d of dirs) {
                let target = getPixel(pixel.x + d[0], pixel.y + d[1]);
                if (target && target.element === "robot_body") {
                    // stabilise into part of robot
                    pixel.color = "#7f7f7f";
                }
            }
        }
    };

});