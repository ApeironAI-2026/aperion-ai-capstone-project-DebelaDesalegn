import { useEffect, useState } from "react";

function Dashboard() {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    // Replace with your real backend endpoint later
    const API_BASE = "http://127.0.0.1:8000";

    useEffect(() => {
        async function fetchAttendance() {
            try {
                const response = await fetch(`${API_BASE}/attendance/all`);
                const data = await response.json();
                setAttendance(data.records || []);
            } catch (error) {
                console.error("Error fetching attendance:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAttendance();
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
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((record, index) => (
                            <tr key={index}>
                                <td>{record.name}</td>
                                <td>{record.time}</td>
                                <td>{record.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Dashboard;
<td>
    <Link to={`/profile/${record.user_id}`}>
        View Profile
    </Link>
</td>
