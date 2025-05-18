import React, { useEffect, useState } from "react";
import { fetchProtectedData } from "../lib/utils";

const TestAPI = () => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchProtectedData()
            .then(data => setMessage(data.message))
            .catch(error => console.error("Error:", error));
    }, []);

    return (
        <div>
            <h1>API Response:</h1>
            <p>{message}</p>
        </div>
    );
};

export default TestAPI;
