import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate(); // Use navigate for routing

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await fetch("http://localhost:5555/hospitaldashboard/hospitals"); 
        const data = await response.json();
        setHospitals(data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, []);

  const handleView = (hospitalId) => {
    navigate(`/hospital-view/${hospitalId}`);
  };

  const handleEdit = (hospitalId) => {
    navigate(`/hospital-edit/${hospitalId}`);
  };

  const handleDelete = async (hospitalId) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      try {
        const response = await fetch(`http://localhost:5555/hospitaldashboard/${hospitalId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setHospitals(hospitals.filter(hospital => hospital.hospitalId !== hospitalId));
          console.log(`Deleted hospital: ${hospitalId}`);
        } else {
          console.error("Failed to delete hospital");
        }
      } catch (error) {
        console.error("Error deleting hospital:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">All Registered Hospitals</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Hospital ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Mobile 1</th>
            <th className="border p-2">Mobile 2</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.length > 0 ? (
            hospitals.map((hospital) => (
              <tr key={hospital.hospitalId} className="text-center">
                <td className="border p-2">{hospital.hospitalId}</td>
                <td className="border p-2">{hospital.hospitalName}</td>
                <td className="border p-2">{hospital.email}</td>
                <td className="border p-2">{hospital.mobile1}</td>
                <td className="border p-2">{hospital.mobile2 || "N/A"}</td>
                <td className="border p-2">{hospital.status}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleView(hospital.hospitalId)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mx-1"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(hospital.hospitalId)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mx-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hospital.hospitalId)}
                    className="bg-red-500 text-white px-2 py-1 rounded mx-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center p-4">No hospitals found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
