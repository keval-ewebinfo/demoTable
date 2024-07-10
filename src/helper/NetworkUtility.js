import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: ' https://api.biznext.mybiznext.in',
    baseURL: 'https://api.biznext.mybiznext.com',
});

axiosInstance.interceptors.request.use(
    (config) => {
        console.log('axios request =>', config);
        return config;
    },
    (error) => {
        console.log('axios request error =>', error.response || error);
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    (config) => {
        console.log('axios response =>', config);
        return config;
    },
    (error) => {
        console.log('axios response error =>', error.response || error);
        return Promise.reject(error);
    },
);

const getFormData = (object) => {
    const formData = new FormData();

    Object.keys(object).forEach((key) => {
        formData.append(key, object[key]);
    });
    return formData;
};

export const APICall = async (method = 'post', body, url = null, headers = null, formData = false) => {
    const config = {
        method: method.toLowerCase(),
        timeout: 1000 * 60 * 2,
    };
    if (url) {
        config.url = url;
    }
    if (body && method.toLowerCase() === 'get') {
        config.params = body;
    } else if (body && method.toLowerCase() === 'post' && !formData) {
        config.data = body;
    } else if (body && method.toLowerCase() === 'post' && formData) {
        config.data = getFormData(body);
    } else {
        config.data = body;
    }
    if (headers) {
        config.headers = { ...headers };
    }
    if (formData) {
        config.headers = {
            ...config.headers,
            'Content-Type': 'multipart/form-data',
        };
        config.transformRequest = (data, headers) => {
            return config.data;
        };
    }

    return new Promise((resolve, reject) => {
        axiosInstance(config)
            .then((res) => {
                resolve({ statusCode: res.status, data: res.data });
            })
            .catch((error) => {
                if (error.response?.data) {
                    if (error.response.status === 502 || error.response.status === 404) {
                        reject({
                            statusCode: error?.response?.status || 0,
                            data: error,
                            errorString: 'Something went wrong, Please try again later.',
                        });
                    }
                    let errorString = '';
                    if (error.response.data.problems) {
                        const errors = error.response.data.problems;
                        for (let i = 0; i < errors.length; i++) {
                            errorString = errorString === '' ? `${errors[i]}` : `${errorString}\n${errors[i]}`;
                        }
                    } else if (typeof error.response.data.message === 'string') {
                        errorString = error.response.data.message;
                    } else if (typeof error.response.data.message === 'object') {
                        const errors = Object.values(error.response.data.message);
                        for (let i = 0; i < errors.length; i++) {
                            errorString = errorString === '' ? `${errors[i]}` : `${errorString}\n${errors[i]}`;
                        }
                    }
                    reject({
                        statusCode: error.response.status,
                        data: error.response.data,
                        errorString,
                    });
                    return;
                } else {
                    reject({
                        statusCode: error?.response?.status || 0,
                        data: error,
                        errorString: 'Something went wrong, Please try again later.',
                    });
                }
            });
    });
};
