import { api, backendUrl } from "./api";


export function getChallenge(){
    api.get("/challenge");
}