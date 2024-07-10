import moment from 'moment';
import React, { useCallback, useMemo } from 'react';
import { convertHours } from '../helper/util';
import '../assets/style.css';

const Employees = ({ EmployeeData = [] }) => {
    const currentDays = useMemo(() => [...Array(moment().date())], []);

    const getStyle = useCallback((time) => {
        if (!time) return { backgroundColor: '#FFFFFF' };
        const minutes = convertHours(time);
        if (minutes >= 0 && minutes <= 60) return { backgroundColor: '#FFFFFF' };
        if (minutes > 60 && minutes <= 480) return { backgroundColor: '#f4e5b5' };
        if (minutes > 480 && minutes <= 540) return { backgroundColor: '#ffb38a' };
        if (minutes > 540) return { backgroundColor: '#cef1ce' };
        return { backgroundColor: '#FFFFFF' };
    }, []);

    return (
        <div>
            <table className="employeeTable">
                <thead>
                    <tr>
                        <th>Employee Name</th>
                        {currentDays.map((_, index) => {
                            return <th key={String(index)}>{index + 1}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {EmployeeData.map((data, i) => {
                        return (
                            <tr key={String(i)}>
                                <td>{data.EmployeeName}</td>
                                {currentDays.map((_, index) => {
                                    return (
                                        <td key={String(index)} style={getStyle(data?.[index + 1] || 0)}>
                                            {data?.[index + 1]}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default React.memo(Employees);
