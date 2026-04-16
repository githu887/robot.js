runAfterLoad(() => {

    elements.robot = {
        color: "#8a8a8a",
        category: "life",
        state: "solid",
        density: 5000,

        tick(pixel) {

            // =========================
            // INIT ROBOT DATA
            // =========================
            if (!pixel.parts) {
                pixel.parts = 1; // starts as 2-pixel creature (head + body)
                pixel.energy = 100;
            }

            let x = pixel.x;
            let y = pixel.y;

            // =========================
            // ENERGY DRAIN (oil survival logic)
            // =========================
            pixel.energy -= 0.05;

            if (pixel.energy <= 0) {
                // robot dies
                deletePixel(x, y);
                return;
            }

            // =========================
            // SCAN AROUND FOR IRON / OIL
            // =========================
            let dirs = [
                [1,0],[-1,0],[0,1],[0,-1],
                [1,1],[-1,1],[1,-1],[-1,-1]
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

                    pixel.parts++;     // grow body
                    pixel.energy += 30;

                    createPixel("additioned_iron", nx, ny);
                }

                // =========================
                // DRINK OIL
                // =========================
                if (target.element === "oil") {
                    deletePixel(nx, ny);
                    pixel.energy += 50;
                }
            }

            // =========================
            // FIXED POSITION (NO MOVEMENT)
            // =========================
            // robot stays in place, only interacts

        }
    };


    // =========================
    // GROWTH MATERIAL
    // =========================
    elements.additioned_iron = {
        color: "#7a7a7a",
        behavior: behaviors.WALL,
        category: "life",
        state: "solid",

        tick(pixel) {
            // slowly fades into robot structure
            if (Math.random() < 0.01) {
                changePixel(pixel, "robot");
            }
        }
    };

});
