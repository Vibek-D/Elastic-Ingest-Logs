const axios = require("axios");
const log = require("log");
const https = require("https");
const awsAxios = require("aws4-axios");
const {
  ElasticsearchServiceClient,
  AcceptInboundCrossClusterSearchConnectionCommand,
} = require("@aws-sdk/client-elasticsearch-service");

// const client = new ElasticsearchServiceClient({ region: "ap-south-1" });

// try {
//   const data = await client.send(command);
//   console.log(data);
// } catch (error) {
//   console.log(error);
// } finally {
//   console.log("done");
// }

const client = axios.create({
  baseURL:
    "https://search-testing-zrzejobm6lpkb67yx2u7cjwqg4.ap-south-1.es.amazonaws.com/",
});

client.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      log.error("Error in elasticsearch request", error.response.data);
      return Promise.reject(error.response.data);
    }
    log.error("Unknown error in elasticsearch request", error);
    return Promise.reject(error);
  }
);

const data = JSON.stringify({
  firstName: "Fred",
  lastName: "Flintstone",
});

const interceptor = awsAxios.aws4Interceptor({
  region: "ap-south-1",
  service: "es",
});
client.interceptors.request.use(interceptor);

// axios({
//   baseURL:
//     "https://search-testing-zrzejobm6lpkb67yx2u7cjwqg4.ap-south-1.es.amazonaws.com/sample",
//   auth: { username: "admin", password: "Password@000" },
//   data: JSON.stringify({
//     firstName: "Fred",
//     lastName: "Flintstone",
//   }),
// }).then((res) => console.log(res.body));

const dataIngest = async () => {
  try {
    const pushedData = await client.post(
      `https://search-testing-zrzejobm6lpkb67yx2u7cjwqg4.ap-south-1.es.amazonaws.com/sample`,
      data,
      {
        headers: {
          "Content-Type": "application/x-ndjson",
        },
      }
    );
    console.log(pushedData);
  } catch (e) {
    console.log(e);
  }
};

dataIngest();
