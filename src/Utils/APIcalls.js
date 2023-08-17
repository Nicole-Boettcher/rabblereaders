class APIcalls {
  constructor(data) {
    this.dataToSend = data;
  }
  async callQuery() {
    //console.log("inside callPutItem");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.dataToSend),
    };

    //console.log(JSON.stringify(this.dataToSend));

    return fetch(
      "https://1s6o72uevg.execute-api.ca-central-1.amazonaws.com/Dev/bookclub",
      requestOptions
    )
      .then((response) => response.json())
  }
}

export default APIcalls;
