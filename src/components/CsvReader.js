import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { BsPencilSquare } from "react-icons/bs";
import "../style.css";

const CsvReader = () => {
  const [csvFile, setCsvFile] = useState();
  const [csvArray, setCsvArray] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editField, setEditField] = useState({
    firstName: "",
    lastName: "",
    age: "",
    sex: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const processCSV = (str, delim = ",") => {
    var headers = str.slice(0, str.indexOf("\n")).split(delim);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const newArray = rows.map((row, id) => {
      const values = row.split(delim);
      // console.log("values", values);

      const eachObject = headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        obj["id"] = id;

        return obj;
      }, {});
      return eachObject;
    });
    // console.log(headers);
    // console.log("newArray", newArray);

    setCsvArray(newArray);
  };

  const submit = () => {
    const file = csvFile;
    file === undefined
      ? setErrorMsg("Please import a file")
      : setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      processCSV(text);
    };
    reader.readAsText(file);
  };

  const handleEdit = (id) => {
    setEdit(true);
    let editableField = csvArray.find((item) => item.id === id);
    setEditField(editableField);
  };
  const handleDelete = (id) => {
    const filteredArray = csvArray.filter((item) => item.id !== id);
    setCsvArray([...filteredArray]);
  };
  const handleSubmit = () => {
    const newcsvarray = csvArray.map((item, index) =>
      item.id === editField.id ? editField : item
    );

    setCsvArray(newcsvarray);
    setEdit(false);
  };

  const handleEditField = (e) => {
    setEditField({ ...editField, [e.target.name]: e.target.value });
  };

  return (
    <div className="content">
      <h3>Crud App</h3>
      {edit ? (
        <div className="edit">
          <input
            type="text"
            placeholder="First Name"
            onChange={handleEditField}
            value={editField.firstName}
            name="firstName"
          />
          <input
            type="text"
            placeholder="Last Name"
            onChange={handleEditField}
            value={editField.lastName}
            name="lastName"
          />
          <input
            type="text"
            placeholder="Age"
            onChange={handleEditField}
            value={editField.age}
            name="age"
          />
          <input
            type="text"
            placeholder="sex"
            onChange={handleEditField}
            value={editField.sex}
            name="sex"
          />
          <button type="button" onClick={handleSubmit} className="edit-submit">
            submit
          </button>
        </div>
      ) : null}

      <form id="csv-form">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files[0])}
          id="csvFile"
        />
        <br />
        <br />

        <button
          onClick={(e) => {
            e.preventDefault();
            // if (csvFile) submit();
            submit();
          }}
        >
          submit
        </button>
        {errorMsg}
        <br />
        {csvArray.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Age</th>
                  <th>Sex</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {csvArray.map((item, i) => (
                  <tr key={item.id}>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.age}</td>
                    <td>{item.sex}</td>
                    {item.firstName === undefined ? null : (
                      <td>
                        <FiTrash2
                          onClick={() => handleDelete(item.id)}
                          style={{ cursor: "pointer", marginRight: "10px" }}
                          color="red"
                        />
                        <BsPencilSquare
                          onClick={(e) => handleEdit(item.id)}
                          style={{ cursor: "pointer" }}
                          color="green"
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : //
        null}
      </form>
    </div>
  );
};

export default CsvReader;
