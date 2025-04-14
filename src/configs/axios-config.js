import axios from "axios";

class axiosBackend {
    initiate(){
        this.instance = axios.create({
            baseURL: `http://localhost:3000/api/`,
            timeout: 1000,
        })
    }

    constructor(){
        this.initiate();
    }

    get(){
        if(!this.instance){
            this.initiate();
        }
        return this.instance
    }
}

const connector = new axiosBackend();

const connection = connector.get();

export default connection;