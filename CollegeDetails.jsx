import React, { useState , useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Modal,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { addDoc, collection, getDocs, deleteDoc,updateDoc, doc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';




const db = getFirestore();  

const customColorPalette = {
  lightBlue: '#f4faff', // Light Blue
};


  const CollegeDetailsPage = () => {
  const location = useLocation();
  const [h5Content, setH5Content] = useState(location.state?.h5Content || '');
  const colleges = ["Acharya Institute of Graduate Studies,", "BGS college of Engineering & Technology", "Bangalore North University"];
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState(''); // State for 'from' date
  const [toDate, setToDate] = useState('');     // State for 'to' date
  const [selectedWeek, setSelectedWeek] = useState("");
  const [compname,setcompname ] = useState("");
  const [name, setName] = useState(""); 
  const [collegeName, setCollegeName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [presentWeekStatus, setPresentWeekStatus] = useState("");
  const [previousWeekStatus, setPreviousWeekStatus] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [companyAssigned, setCompanyAssigned] = useState("");
  const [projectAssigned, setProjectAssigned] = useState("");
  const [studentsData, setStudentsData] = useState([]);
  const [companyCountData, setCompanyCountData] = useState({});
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState(null);

  const handleUpdate = (studentId) => {
    const studentToUpdate = studentsData.find((student) => student.id === studentId);
    setEditedStudent(studentToUpdate);
    setIsEditing(true);
  };

  const handleCloseEditModal = () => {
    setIsEditing(false);
    setEditedStudent(null);
  };

 const handleSaveChanges = async () => {
  try {
    // Update the student details in the Firebase database
    const studentDocRef = doc(db, 'students', editedStudent.id);
    await updateDoc(studentDocRef, {
      presentWeekStatus: editedStudent.presentWeekStatus,
      previousWeekStatus: editedStudent.previousWeekStatus,
      email: editedStudent.email,
      mobileNumber: editedStudent.mobileNumber,
      // Update other fields as needed
    });

    // Update the student's data in the state
    setStudentsData((prevStudentsData) =>
      prevStudentsData.map((student) =>
        student.id === editedStudent.id ? { ...student, ...editedStudent } : student
      )
    );

    // Reset the editedStudent and isEditing state
    setEditedStudent(null);
    setIsEditing(false);
  } catch (error) {
    console.error('Error updating student details: ', error);
    // Handle any errors that occur during the update process
    // You may display an error message to the user
  }
};
  

  
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'students'));
        const fetchedStudentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Update the studentsData state with the fetched data
        setStudentsData(fetchedStudentsData);
  
        // Calculate company-wise student counts
        const counts = {};
  
        for (const student of fetchedStudentsData) {
          const company = student.compname;
          counts[company] = counts[company] ? counts[company] + 1 : 1;
        }
  
        setCompanyCountData(counts);
      } catch (e) {
        console.error('Error fetching students data: ', e);
      }
    };
  
    fetchData();
  }, []); // Empty dependency array to run this effect only once
  



  const handleFromDateChange = (event) => {
    setFromDate(event.target.value);
  };
  
  const handleToDateChange = (event) => {
    setToDate(event.target.value);
  };
  

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };


  const handlePresentWeekStatusChange = (event) => {
    setPresentWeekStatus(event.target.value);
  };

  const handlePreviousWeekStatusChange = (event) => {
    setPreviousWeekStatus(event.target.value);
  };
  
  
  const handleCreate = async () => {
    const newStudent = {
      compname:h5Content,
      name,
      collegename: collegeName,
      branch,
      year,
      startDate,
      endDate,
      companyAssigned,
      projectAssigned,
      presentWeekStatus,
      previousWeekStatus,
      email, // Include email
      mobileNumber, // Include mobile number
      timestamp: serverTimestamp(),
    };
  
    const db = getFirestore();
    try {
      const docRef = await addDoc(collection(db, 'students'), newStudent);
      console.log('Document written with ID: ', docRef.id);
  
      // Fetch the updated data from the database
      const querySnapshot = await getDocs(collection(db, 'students'));
      const updatedStudentsData = querySnapshot.docs.map((doc) => doc.data());
  
      // Update the state with the updated data
      setStudentsData(updatedStudentsData);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  

    
    // Clear input fields after creating a new student
    setCollegeName('');
    setStartDate('');
    setEndDate('');
    setPresentWeekStatus('');
    setPreviousWeekStatus('');
    setBranch('');
    setYear('');
    setCompanyAssigned('');
    setProjectAssigned('');
    setName('');
    setH5Content('');
    setMobileNumber(''); // Clear mobile number
    setEmail('');
    window.location.reload();
  };
  
  

  const handleDelete = (studentId) => {
    console.log('Attempting to delete student with ID:', studentId);
    try {
      // Delete the document in Firebase using the provided studentId
      deleteDoc(doc(db, 'students', studentId));
      console.log('Document deleted successfully');
  
      // Update the state by removing the student with the provided ID
      setStudentsData((prevStudentsData) =>
        prevStudentsData.filter((student) => student.id !== studentId)
      );
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };
 
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');


  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };
  

  const filteredStudentsData = studentsData.filter((student) => {
    const collegeFilter = selectedCollege ? student.collegename === selectedCollege : true;
    const companyFilter = selectedCompany ? student.company === selectedCompany : true;
    const searchTermLowerCase = searchTerm.toLowerCase();
  
    const studentStartDate = new Date(student.startDate).getTime();
    const studentEndDate = new Date(student.endDate).getTime();
  
    const fromDateMillis = fromDate ? new Date(fromDate).getTime() : 0;
    const toDateMillis = toDate ? new Date(toDate).getTime() + 24 * 60 * 60 * 1000 : Number.MAX_SAFE_INTEGER;
  
  
    return (
      collegeFilter &&
      companyFilter &&
      studentStartDate >= fromDateMillis &&
      studentEndDate <= toDateMillis &&
      (student.collegename?.toLowerCase().includes(searchTermLowerCase) ||
        student.compname?.toLowerCase().includes(searchTermLowerCase) ||
        student.name?.toLowerCase().includes(searchTermLowerCase) ||
        student.branch?.toLowerCase().includes(searchTermLowerCase) ||
        student.year?.toLowerCase().includes(searchTermLowerCase) ||
        student.companyAssigned?.toLowerCase().includes(searchTermLowerCase) ||
        student.projectAssigned?.toLowerCase().includes(searchTermLowerCase) ||
        student.presentWeekStatus?.toLowerCase().includes(searchTermLowerCase) ||
        student.previousWeekStatus?.toLowerCase().includes(searchTermLowerCase))
        
    );
  });

  const filteredStudentCount = filteredStudentsData.length;
   

  return (
    <>
      <h1 className='detailsPageTitle'>Details Page</h1>
      <Container>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} mt={2}>
              {/* Add a read-only TextField at the top */}
              <TextField
        fullWidth
        label="Read-only Text"
        variant="outlined"
        value={h5Content || ''}
        InputProps={{
          readOnly: true,
        }}
              
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} >
      <Grid item xs={12} mt={2}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(event) => setName(event.target.value)}
              InputProps={{
                style: { backgroundColor: customColorPalette.lightBlue }
              }}
            />
          </Grid>
          </Grid>
          
        <Grid container spacing={2}>
          <Grid item xs={12} mt={2}>
            <TextField
              fullWidth
              label="College Name"
              select
              variant="outlined"
              value={collegeName}
              onChange={(event) => setCollegeName(event.target.value)}
              InputProps={{
                style: { backgroundColor: customColorPalette.lightBlue }
              }}
            >
              {colleges.map((college) => (
                <MenuItem key={college} value={college}>
                  {college}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                InputProps={{
                  style: { backgroundColor: customColorPalette.lightBlue }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                variant="outlined"
                value={mobileNumber}
                onChange={(event) => {
                  const input = event.target.value;
                  // Allow only numbers (0-9) and limit to 10 characters
                  const sanitizedInput = input.replace(/\D/g, '').slice(0, 10);
                  setMobileNumber(sanitizedInput);
                }}
                InputProps={{
                  style: { backgroundColor: customColorPalette.lightBlue }
                }}
              />
            </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                style: { fontWeight: 'bold', backgroundColor: '#f4faff' }
              }}
              value={startDate}
              onChange={handleStartDateChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                style: { fontWeight: 'bold', backgroundColor: '#f4faff' }
              }}
              value={endDate}
              onChange={handleEndDateChange}
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Present week Status"
              variant="outlined"
              value={presentWeekStatus}
              onChange={handlePresentWeekStatusChange}
              InputProps={{
                style: {backgroundColor: customColorPalette.lightBlue}
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Previous week Status"
              variant="outlined"
              value={previousWeekStatus}
              onChange={handlePreviousWeekStatusChange}
              InputProps={{
                style: {backgroundColor: customColorPalette.lightBlue}
              }}
            />
          </Grid>
          
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Branch"
              variant="outlined"
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
              InputProps={{
                style: { backgroundColor: customColorPalette.lightBlue }
              }}
            />
          </Grid>

          {/* New TextField for Year */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Year"
              variant="outlined"
              value={year}
              onChange={(event) => setYear(event.target.value)}
              InputProps={{
                style: { backgroundColor: customColorPalette.lightBlue }
              }}
            />
          </Grid>

          {/* New TextField for Company Assigned */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Company Assigned"
              variant="outlined"
              value={companyAssigned}
              onChange={(event) => setCompanyAssigned(event.target.value)}
              InputProps={{
                style: { backgroundColor: customColorPalette.lightBlue }
              }}
            />
          </Grid>

          {/* New TextField for Project Assigned */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Project Assigned"
              variant="outlined"
              value={projectAssigned}
              onChange={(event) => setProjectAssigned(event.target.value)}
              InputProps={{
                style: { backgroundColor: customColorPalette.lightBlue }
              }}
            />
          </Grid>
          </Grid>
          <Grid container spacing={2} mt={4}>
           <Grid item xs={6}>
              <Button variant="contained" color="primary" onClick={handleCreate}>
                Create
              </Button>
            </Grid>
          </Grid>
          <Typography variant="h6" align="left">
              Company-wise Student Counts:
            </Typography>
            <ul>
              {Object.entries(companyCountData).map(([company, count]) => (
                <li key={company}>
                  {`${company}: ${count} student${count !== 1 ? 's' : ''}`}

                </li>
              ))}
            </ul>

        <Typography variant="h5" align="center" mt={8}>
          {selectedWeek} Displaying the Students Details
        </Typography>
        <Grid item xs={10} mt={4}>
        <TextField
          fullWidth
          label="Search by Company or College "
          variant="outlined" 
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
      </Grid>
      
      <Grid container spacing={2}>
      <Grid item xs={6} mt={4}>
        <TextField
          fullWidth
          label="From Date"
          type="date"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: { fontWeight: 'bold', backgroundColor: '#f4faff' }
          }}
          value={fromDate}
          onChange={handleFromDateChange}
        />
      </Grid>
      <Grid item xs={6} mt={4}>
        <TextField
          fullWidth
          label="To Date"
          type="date"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            style: { fontWeight: 'bold', backgroundColor: '#f4faff' }
          }}
          value={toDate}
          onChange={handleToDateChange}
        />
      </Grid>
    </Grid>
      
      <Typography variant="h6" align="left">
        {searchTerm && filteredStudentCount > 0
          ? `Students count for ${searchTerm}: ${filteredStudentCount}`
          : ''}
      </Typography>
      
    
      <TableContainer component={Paper} style={{ border: '2px solid #333', width: '1500px', margin: '10px' ,}}>
      <Table style={{ border: '2px solid #333' }}>
            <TableHead>
              <TableRow>
                <TableCell style={{ borderBottom: "2px solid #333", color: "#0000FF" }}><b>Company</b></TableCell>
                <TableCell style={{ borderBottom: "2px solid #333", color: "#0000FF" }}><b>Name</b></TableCell>
                <TableCell style={{ borderBottom: "2px solid #333", color: "#0000FF" }}><b>College Name</b></TableCell>
                <TableCell style={{ borderBottom: "2px solid #333", color: "#0000FF" }}><b>Branch</b></TableCell>
                <TableCell style={{ borderBottom: "2px solid #333", color: "#0000FF" }}><b>Year</b></TableCell>
                <TableCell style={{ borderBottom: "2px solid #333", color: "#0000FF" }}><b>Start Date</b></TableCell>
                <TableCell style={{ borderBottom: "2px solid #333", color: "#0000FF" }}><b>End Date</b></TableCell>
                <TableCell style={{ borderBottom: "2px solid #333", color: "#0000FF" }}><b>Company Assigned</b></TableCell>
                <TableCell style={{ borderBottom: "2px solid #333", color: "#0000FF" }}><b>Project Assigned</b></TableCell>
                <TableCell style={{ borderBottom: "2px solid #333", color: "#0000FF" }}><b>Present week Status</b></TableCell>
                <TableCell style={{ borderBottom: "2px solid #333", color: "#0000FF" }}><b>Previous week Status</b></TableCell>
                <TableCell style={{ borderBottom: "2px solid #333", color: "#0000FF" }}><b>Email</b></TableCell>
                <TableCell style={{ borderBottom: "2px solid #333", color: "#0000FF" }}><b>Mobile Number</b></TableCell>
                <TableCell style={{ borderBottom: "2px solid #333", color: "#0000FF" }}>
                <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudentsData.map((student, index) => (
                <TableRow key={index}>
                  <TableCell style={{ borderBottom: "2px solid #333" }}>{student.compname}</TableCell>
                  <TableCell style={{ borderBottom: "2px solid #333" }}>{student.name}</TableCell>
                  <TableCell style={{ borderBottom: "2px solid #333" }}>{student.collegename}</TableCell>
                  <TableCell style={{ borderBottom: "2px solid #333" }}> {student.branch}</TableCell>
                  <TableCell style={{ borderBottom: "2px solid #333" }}> {student.year}</TableCell>
                  <TableCell style={{ borderBottom: "2px solid #333" }}> {student.startDate}</TableCell>
                  <TableCell style={{ borderBottom: "2px solid #333" }}> {student.endDate}</TableCell>
                  <TableCell style={{ borderBottom: "2px solid #333" }}> {student.companyAssigned}</TableCell>
                  <TableCell style={{ borderBottom: "2px solid #333" }}>{student.projectAssigned}</TableCell>
                  <TableCell style={{ borderBottom: "2px solid #333" }}>{student.presentWeekStatus}</TableCell>
                  <TableCell style={{ borderBottom: "2px solid #333" }}>{student.previousWeekStatus}</TableCell>
                  <TableCell style={{ borderBottom: "2px solid #333" }}>{student.email}</TableCell>
                  <TableCell style={{ borderBottom: "2px solid #333" }}>{student.mobileNumber}</TableCell>
                  
                  <TableCell style={{ borderBottom: "2px solid #333" }}>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(student.id)}>
                    Delete
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => handleUpdate(student.id)}>
                    Update
                  </Button>
                </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </Container>
        {/* Modal for Editing Student Details */}
        {isEditing && editedStudent && (
          <Modal open={isEditing} onClose={handleCloseEditModal}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
              <h2>Edit Student Details</h2>
              {/* Implement the form to edit student details using editedStudent */}
              <TextField
                label="Present week status"
                variant="outlined"
                value={editedStudent.presentWeekStatus}
                onChange={(event) => setEditedStudent({ ...editedStudent, presentWeekStatus: event.target.value })}
                fullWidth
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Previous week status"
                variant="outlined"
                value={editedStudent.previousWeekStatus}
                onChange={(event) => setEditedStudent({ ...editedStudent, previousWeekStatus: event.target.value })}
                fullWidth
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Email"
                variant="outlined"
                value={editedStudent.email}
                onChange={(event) => setEditedStudent({ ...editedStudent, email: event.target.value })}
                fullWidth
                style={{ marginBottom: '10px' }}
              />
              <TextField
                label="Mobile Number"
                variant="outlined"
                value={editedStudent.mobileNumber}
                onChange={(event) => {
                  // Allow only numbers (0-9) and limit to 10 digits
                  const input = event.target.value.replace(/\D/g, '').slice(0, 10);
                  setEditedStudent({ ...editedStudent, mobileNumber: input });
                }}
                fullWidth
                style={{ marginBottom: '10px' }}
              />

              <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                Save Changes
              </Button>
              <Button variant="contained" color="secondary" onClick={handleCloseEditModal}>
                Cancel
              </Button>
            </div>
          </Modal>
        )}
    </>
  );
};

export default CollegeDetailsPage; 