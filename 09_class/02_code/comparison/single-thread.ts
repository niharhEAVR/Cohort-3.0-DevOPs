const target = 1_000_000_000_0;
const startTime = Date.now()

let count = 0;
for (let i = 0; i < target; i++) {
    count += i;
}

const endTime = Date.now()

console.log(`Totol time: ${endTime-startTime} ms`)