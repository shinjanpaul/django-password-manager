import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";


const GRAPHQL_ENDPOINT = 'http://localhost:8000/graphql/';

const graphqlRequest = async (query, variables = {}) => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ query, variables }),
  });
  const result = await response.json();
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data;
};

const Manager = () => {
  const [form, setForm] = useState({
    site: "",
    username: "",
    password: "",
  });

  const [passwords, setPasswords] = useState([]);


  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      const query = `
        query {
          myPasswords {
            id
            websiteUrl
            username
            password
          }
        }
      `;
      const data = await graphqlRequest(query);
      setPasswords(data.myPasswords || []);
    } catch (error) {
      console.error('Error fetching passwords:', error);
      toast.error('Failed to fetch passwords. Make sure Django is running!', {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  const copytext = (text) => {
    toast.success("Copied to Clipboard 🚀", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text);
  };

  const savepassword = async () => {
    console.log(form);


    if (!form.site || !form.username || !form.password) {
      toast.error('Please fill all fields!', {
        position: "top-center",
        autoClose: 1000,
        theme: "dark",
      });
      return;
    }

    try {

      const mutation = `
        mutation CreatePassword($websiteUrl: String!, $username: String!, $password: String!) {
          createPassword(websiteUrl: $websiteUrl, username: $username, password: $password) {
            passwordEntry {
              id
              websiteUrl
              username
              password
            }
          }
        }
      `;
      
      await graphqlRequest(mutation, {
        websiteUrl: form.site,
        username: form.username,
        password: form.password,
      });


      await fetchPasswords();


      setForm({ site: "", username: "", password: "" });

      toast.success('Password saved! 👍🏻', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.error('Error saving password:', error);
      toast.error('Failed to save: ' + error.message, {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  const deletepassword = async (id) => {
    console.log("Deleting password with id", id);

    try {
      const mutation = `
        mutation DeletePassword($id: Int!) {
          deletePassword(id: $id) {
            success
          }
        }
      `;
      
      await graphqlRequest(mutation, { id: parseInt(id) });


      await fetchPasswords();

      toast.warn("Password Deleted Successfully!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.error('Error deleting password:', error);
      toast.error('Failed to delete', {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  const editpassword = (id) => {
    console.log("Editing password with id", id);


    const passwordToEdit = passwords.find((item) => item.id === id);
    if (!passwordToEdit) return;


    setForm({
      site: passwordToEdit.websiteUrl,
      username: passwordToEdit.username,
      password: passwordToEdit.password,
    });
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="fixed inset-0 -z-10 bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

     <div className="bg-slate-50 w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 h-screen overflow-hidden flex flex-col">
        <div className="pt-12 pb-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text font-bold text-center">
            <span className="text-green-700">&lt;</span>
            <span>Pass</span>
            <span className="text-green-700">manager/&gt;</span>
          </h1>
          <p className="text-green-900 text-base sm:text-lg text-center">
            Your own Password Manager (Django + GraphQL)
          </p>
        </div>

        {}
        <div className="text-white flex flex-col p-3 sm:p-4">
          <input
            value={form.site}
            onChange={(e) => setForm({ ...form, site: e.target.value })}
            className="rounded-full bg-white px-4 py-2 sm:py-3 text-black mb-4 w-full"
            type="text"
            placeholder="Website URL"
          />
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="rounded-full bg-white px-4 py-2 sm:py-3 text-black flex-1"
              type="text"
              placeholder="Username"
            />
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="rounded-full bg-white px-4 py-2 sm:py-3 text-black flex-1"
              type="password"
              placeholder="Password"
            />
          </div>
        </div>

      
        <div className="flex justify-center items-center mb-0">
          <button
            onClick={savepassword}
            className="group bg-green-500 hover:bg-green-600 text-black px-4 py-2 sm:px-6 sm:py-3 rounded-full active:translate-y-0.5 active:shadow-sm shadow-lg transition-all duration-150 flex items-center gap-2"
          >
            <lord-icon
              src="https://cdn.lordicon.com/ueoydrft.json"
              trigger="hover"
              target=".group"
            ></lord-icon>
            Save
          </button>
        </div>

        
        <div className="yourpass px-2 sm:px-4 flex-1 overflow-hidden flex flex-col">
          <h2 className="font-bold py-0 text-xl sm:text-2xl ">Your Passwords</h2>

          {passwords.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No passwords available.
            </p>
          ) : (
            <>
              
<div className="hidden md:block overflow-x-auto overflow-y-auto rounded-lg shadow-md mb-4" style={{ maxHeight: '290px' }}>
                <table className="table-auto w-full border-collapse">
                  <thead className="bg-green-800 text-white sticky top-0 z-10">
                    <tr>
                      <th className="py-2 border border-white">Site</th>
                      <th className="py-2 border border-white">Username</th>
                      <th className="py-2 border border-white">Password</th>
                      <th className="py-2 border border-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-green-100">
                    {passwords.map((entry) => (
                      <tr key={entry.id}>
                        <td
                          className="text-center py-2 border border-white cursor-pointer hover:bg-green-200"
                          onClick={() => copytext(entry.websiteUrl)}
                        >
                          {entry.websiteUrl}
                          <FontAwesomeIcon icon={faCopy} className="ml-1" />
                        </td>
                        <td
                          className="text-center py-2 border border-white cursor-pointer hover:bg-green-200"
                          onClick={() => copytext(entry.username)}
                        >
                          {entry.username}
                          <FontAwesomeIcon icon={faCopy} className="ml-1" />
                        </td>
                        <td
                          className="text-center py-2 border border-white cursor-pointer hover:bg-green-200"
                          onClick={() => copytext(entry.password)}
                        >
                          {entry.password}
                          <FontAwesomeIcon icon={faCopy} className="ml-1" />
                        </td>
                        <td className="text-center py-2 border border-white">
                          <span
                            className="cursor-pointer mx-1"
                            onClick={() => editpassword(entry.id)}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/exymduqj.json"
                              trigger="hover"
                              stroke="bold"
                              colors="primary:#121331,secondary:#000000"
                              style={{ width: "25px", height: "25px" }}
                            ></lord-icon>
                          </span>
                          <span
                            className="cursor-pointer mx-1"
                            onClick={() => deletepassword(entry.id)}
                          >
                            <lord-icon
                              src="https://cdn.lordicon.com/jzinekkv.json"
                              trigger="hover"
                              stroke="bold"
                              colors="primary:#121331,secondary:#000000"
                              style={{ width: "25px", height: "25px" }}
                            ></lord-icon>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              
              <div className="md:hidden space-y-4 overflow-y-auto rounded-lg flex-1 mb-4">
                {passwords.map((entry) => (
                  <div key={entry.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                    <div className="space-y-3">
                      <div
                        className="cursor-pointer p-2 bg-gray-50 rounded hover:bg-gray-100"
                        onClick={() => copytext(entry.websiteUrl)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-semibold text-gray-600">Site:</span>
                            <p className="text-base break-all">{entry.websiteUrl}</p>
                          </div>
                          <FontAwesomeIcon icon={faCopy} className="text-gray-400" />
                        </div>
                      </div>

                      <div
                        className="cursor-pointer p-2 bg-gray-50 rounded hover:bg-gray-100"
                        onClick={() => copytext(entry.username)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-semibold text-gray-600">Username:</span>
                            <p className="text-base break-all">{entry.username}</p>
                          </div>
                          <FontAwesomeIcon icon={faCopy} className="text-gray-400" />
                        </div>
                      </div>

                      <div
                        className="cursor-pointer p-2 bg-gray-50 rounded hover:bg-gray-100"
                        onClick={() => copytext(entry.password)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-semibold text-gray-600">Password:</span>
                            <p className="text-base">{entry.password}</p>
                          </div>
                          <FontAwesomeIcon icon={faCopy} className="text-gray-400" />
                        </div>
                      </div>

                      <div className="flex justify-center gap-8 pt-3 border-t border-gray-200">
                        <span
                          className="cursor-pointer"
                          onClick={() => editpassword(entry.id)}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/exymduqj.json"
                            trigger="hover"
                            stroke="bold"
                            colors="primary:#121331,secondary:#000000"
                            style={{ width: "30px", height: "30px" }}
                          ></lord-icon>
                        </span>
                        <span
                          className="cursor-pointer"
                          onClick={() => deletepassword(entry.id)}
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/jzinekkv.json"
                            trigger="hover"
                            stroke="bold"
                            colors="primary:#121331,secondary:#000000"
                            style={{ width: "30px", height: "30px" }}
                          ></lord-icon>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;