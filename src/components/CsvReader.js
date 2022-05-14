import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { BsPencilSquare } from "react-icons/bs";

const compareFn = (a, b) => {
  //   if (a > b) return 1;
  //   if (b > a) return -1;
  //   return 0;
};

const CsvReader = () => {
  const [csvFile, setCsvFile] = useState();
  const [csvArray, setCsvArray] = useState([]);
  const [edit, setEdit] = useState(false);
  const [csvStr, setCsvStr] = useState("");
  const [headers, setHeaders] = useState([]);
  const [fileToExport, setFileToExport] = useState();
  const [errorMsg, setErrorMsg] = useState("");

  const [editField, setEditField] = useState({
    firstName: "",
    lastName: "",
    age: "",
    sex: "",
  });

  const processCSV = (str, delim = ",") => {
    console.log("str:::", str);
    const headers = str
      .slice(0, str.indexOf("\n"))
      .split(delim)
      .sort(compareFn);
    setHeaders(headers);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    console.log("rows", rows);

    const newArray = rows.map((row, id) => {
      const values = row.split(delim);
      console.log("values", values);

      const eachObject = headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        obj["id"] = id;

        return obj;
      }, {});
      return eachObject;
    });

    console.log("newArray", newArray);

    setCsvArray(newArray);
  };

  useEffect(() => {
    let csvStr_ = headers.sort(compareFn).join(",");

    csvStr_ = csvArray.reduce((acc, cur) => {
      const rowStr = Object.values(cur).sort(compareFn).join(",");
      acc += `\n${rowStr}`;
      return acc;
    }, csvStr_);

    setCsvStr(csvStr_);
  }, [csvArray, headers]);

  console.log("headers", headers);
  console.log("csvStr", csvStr);
  console.log("csvArray", csvArray);

  const submit = () => {
    const file = csvFile;

    file === undefined
      ? setErrorMsg("Please import a file")
      : setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      console.log("text", text);
      processCSV(text);
    };
    reader.readAsText(file);
  };

  const handleEdit = (id) => {
    // e.preventDefault();
    setEdit(true);
    let editableField = csvArray.find((item) => item.id == id);
    console.log(editableField);
    setEditField(editableField);

    // console.log(e);
  };
  const handleDelete = (id) => {
    // console.log(firstName);
    // console.log(csvArray);

    const filteredArray = csvArray.filter((item) => item.id !== id);
    setCsvArray([...filteredArray]);
  };
  const handleSubmit = () => {
    console.log(editField);

    const newcsvarray = csvArray.map((item, index) =>
      item.id === editField.id ? editField : item
    );

    console.log(newcsvarray);

    setCsvArray(newcsvarray);
  };

  const handleEditField = (e) => {
    setEditField({ ...editField, [e.target.name]: e.target.value });
  };

  function download(file) {
    const link = document.createElement("a");
    const url = URL.createObjectURL(file);

    link.href = url;
    link.download = csvFile.name;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="content">
      {edit ? (
        <div>
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
            type="number"
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
        <h3>Crud App</h3>

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
            submit();
          }}
        >
          submit
        </button>
        {errorMsg}

        {/* <button
          onClick={(e) => {
            e.preventDefault();
            download();
          }}
        >
          export
        </button> */}
        <br />
        {csvArray.length > 0 ? (
          <>
            <table>
              <thead>
                {headers.map((item) => (
                  <th>{item}</th>
                ))}
              </thead>
              <tbody>
                {csvArray.map((item, i) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.age}</td>
                    <td>{item.sex}</td>

                    {item.firstName === "" ? undefined : (
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
