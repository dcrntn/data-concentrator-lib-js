export { dataConcentrator };

class dataConcentrator {
    ip;

    constructor(ip) {
        this.ip = ip;
    };

    // Gets all the datanode values from the db
    async getAllDnode() {
        let url = `${this.ip}/getall/bucket`;

        let resp = await fetch(url);

        if (resp.ok) {
            let body = await resp.text();
            return JSON.parse(body);
        }
        else {
            return `ERROR: ${resp.status}`;
        }

    }


    // Gets the value for the given uid datanode
    async getDnodeValue(uid) {
        let url = `${this.ip}/r/${uid}`;

        let resp = await fetch(url);

        if (resp.ok) {
            let body = await resp.text();
            return JSON.parse(body)['node_val'];
        }
        else {
            return `ERROR: ${resp.status}`;
        }
    }

    // Writes the value of a datanode
    async writeDnodeValue(uid, value) {
        let url = `${this.ip}/w`;

        let data = {
            'node_uid': uid,
            'node_val': value
        }
        let resp = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
        });

        if (resp.ok) {
            let body = await resp.text();
            return JSON.parse(body);
        }
        else {
            return `ERROR: ${resp.status}`;
        }
    }

    // Some tests.
    // Needs running data concentrator "rAPI" handler
    // Needs some data node uid.
    testMethods() {
        if (this.ip == "http://127.0.0.1:8000") {
            console.log("[TEST] IP IS OK");
        }
        else {
            console.log("[TEST][ERR] IP IS WRONG");
        }

        this.getAllDnode().then(d => {
            if (d.length == 2) {
                console.log("[TEST] getAllDnode() IS OK");
            }
            else {
                console.log("[TEST][ERR] getAllDnode() NOT OK");
            }
        });

        this.writeDnodeValue("W7A327pEYhw0hGzLYTMb", "512").then(d => {
            if (d == "{'changed_count': '1'}") {
                console.log("[TEST] writeDnodeValue() IS OK");
            }
            else {
                console.log("[TEST][ERR] writeDnodeValue() NOT OK");
            }
        });

        this.getDnodeValue("W7A327pEYhw0hGzLYTMb").then(d => {
            if (d == "512") {
                console.log("[TEST] getDnodeValue() IS OK");
            }
            else {
                console.log("[TEST][ERR] getDnodeValue() NOT OK");
            }
        });
    }
}