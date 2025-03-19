import { Link } from 'react-router-dom';
import {AiOutlineEdit} from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import {MdOutlineAddBox, MdOutlineDelete} from 'react-icons/md';


const PatientTable = ({ patient}) => {
  return (
    <table className='w-full border-separate border-spacing-2'>
        <thead>
            <tr>
                <th className='border border-slate-600 rounded-md'>No</th>
                <th className='border border-slate-600 rounded-md'>Name</th>
                <th className='border border-slate-600 rounded-md'>NIC</th>
                <th className='border border-slate-600 rounded-md'>DOB</th>
                <th className='border border-slate-600 rounded-md'>Blood Group</th>
                <th className='border border-slate-600 rounded-md'>Telephone</th>
                <th className='border border-slate-600 rounded-md'>Email</th>
                <th className='border border-slate-600 rounded-md'>Operations</th>
            </tr>
        </thead>
        <tbody>
            {patient.map((patient, index) => (
                <tr key={patient._id} className='h-8'>
                    <td className='border border-slate-700 rounded-md text-center'>
                        {index + 1}
                    </td>
                    <td className='border border-slate-700 rounded-md text-center '>
                        {patient.name}
                    </td>
                    <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                        {patient.nic}
                    </td>
                    <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                        {patient.dob}
                    </td>
                    <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                        {patient.blood}
                    </td>
                    <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                        {patient.tele}
                    </td>
                    <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
                        {patient.email}
                    </td>
                    <td className='border border-slate-700 rounded-md text-center'>
                        <div className='flex justify-center gap-x-4'>
                            <Link to={'/patient/details/${patient._id}'}>
                               <BsInfoCircle className='text-2xl text-green-800' />
                            </Link>
                            <Link to={'/patient/edit/${patient._id}'}>
                               <AiOutlineEdit className='text-2xl text-yellow-600' />
                            </Link>
                            <Link to={'/patient/delete/${patient._id}'}>
                               <MdOutlineDelete className='text-2xl text-red-600' />
                            </Link>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
  );
};

export default PatientTable;
