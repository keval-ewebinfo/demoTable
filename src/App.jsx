import { useEffect, useState } from 'react';
import './App.css';
import { APICall } from './helper/NetworkUtility';
import { Buffer } from 'buffer';
import pako from 'pako';
import Employees from './components/Employees';

function App() {
    const [token, setToken] = useState('181dfbc323e8bef676195c5fdc2478cec89134dcea4dab33bb06b30520d3ee2e36846ff46696af0bd587119077b6c987bf7633dcc2890f6cee3199540');
    const [year, setYear] = useState(2024);
    const [month, setMonth] = useState(7);
    const [EmployeeData, setEmployeeData] = useState([]);
    useEffect(() => {
        _getApiData();
    }, []);

    const _getApiData = async () => {
        try {
            const payload = {
                viewMode: '11',
                companyAddressID: 0,
                employeeMasterID: 0,
                yearID: year,
                monthID: month,
                teamRoleCode: 0,
                objCommon: {
                    insertedUserID: '13',
                    insertedIPAddress: '43.254.176.29',
                    dateShort: 'dd-MM-yyyy',
                    dateLong: 'dd-MM-yyyy HH:mm:ss',
                },
            };
            const header = {
                token: token,
                Apiusername: 50004,
                Companycode: 'BIZN',
                Companyuserid: 13,
                Userloginid: 50004,
                Username: 50004,
                rightcode: '',
                apikey: '',
            };

            const res = await APICall('post', payload, '/HRMS/GetEmployeeWorkingHoursView', header);
            if (res?.data?.responseDynamic) {
                const dataBuffer = Buffer.from(res?.data?.responseDynamic, 'base64');
                const Data = JSON.parse(pako.inflate(dataBuffer, { to: 'string' }));
                setEmployeeData(Data?.Employee || []);
            }
        } catch (error) {
            console.log(error, '---error');
            if (error?.data?.responseMessage) {
                alert(error.data.responseMessage);
            }
        }
    };

    return (
        <div>
            <Employees EmployeeData={EmployeeData} />
        </div>
    );
}

export default App;
