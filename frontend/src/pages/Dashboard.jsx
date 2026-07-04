import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAttendance } from "../api/api";

function Dashboard() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchAttendance();
                setAttendance(data.records || []);
            } catch (error) {
                console.error("Error fetching attendance:", error);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return (
        <div className="container">
            <h2>Attendance Dashboard</h2>

            {loading && <p>Loading attendance...</p>}

            {!loading && attendance.length === 0 && (
                <p>No attendance records found.</p>
            )}

            {!loading && attendance.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Confidence</th>
                            <th>Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((record) => (
                            <tr key={`${record.user_id}-${record.time}`}>
                                <td>{record.name}</td>
                                <td>{record.time}</td>
                                <td>{record.status}</td>
                                <td>{record.confidence?.toFixed?.(2)}</td>
                                <td>
                                    <Link to={`/profile/${record.user_id}`}>
                                        View Profile
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Dashboard;
