import resolvers from "./src/resolvers";
import logs from "./src/log.js";
import displayStatistics from "./src/statistics.js";


async function main() {
    const state = Boolean(localStorage.getItem('jwt'));
    if (state) {
        document.getElementById('login-container').style.display = 'none';
        displayStatistics();
    } else {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('username-display').style.display = 'none';
        document.getElementById('statistics-display').style.display = displayStatistics();
    }
}

main();
