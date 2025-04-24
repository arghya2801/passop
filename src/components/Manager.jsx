import React, { useEffect } from 'react'
import { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setform] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/");
        let passwords = await req.json();
        console.log(passwords);
        setPasswordArray(passwords);
    };

    useEffect(() => {
        getPasswords()

    }, [])

    const copyText = (text) => {
        toast.success('Copied to Clipboard!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        navigator.clipboard.writeText(text);
    };


    const showPassword = () => {
        passwordRef.current.type = "text";
        if (ref.current.src.includes("icons/password_hide.png")) {
            ref.current.src = "icons/password_show.png";
            passwordRef.current.type = "text";
        } else {
            ref.current.src = "icons/password_hide.png";
            passwordRef.current.type = "password";
        }
    };

    // const savePassword = async () => {
    //     // Deleting previous entry while editing to avoid duplicates 
    //     await fetch("http://localhost:3000", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: form.id }) })

    //     setPasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
    //     await fetch("http://localhost:3000", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: uuidv4() }) })
    //     // localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]));
    //     // console.log([...passwordArray, { ...form, id: uuidv4() }]);
    //     setform({ site: "", username: "", password: "" });
    //     toast('Saved successfully!', {
    //         position: "top-right",
    //         autoClose: 1000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: false,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "light",
    //     });
    // };

    const savePassword = async () => {
        // Check if we are editing an existing password
        if (form.id) {
            // Deleting previous entry while editing to avoid duplicates 
            await fetch("http://localhost:3000", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: form.id })
            });
        }

        const newPassword = { ...form, id: uuidv4() };
        setPasswordArray(prev => [...prev.filter(item => item.id !== form.id), newPassword]);

        await fetch("http://localhost:3000", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPassword)
        });

        setform({ site: "", username: "", password: "" });

        toast('Saved successfully!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const deletePassword = async (id) => {
        let c = confirm("Do you want to delete the password?");
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id != id));
            // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(item => item.id != id)));
            let res = await fetch(
                "http://localhost:3000", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
            console.log("Deleting ", id);

            toast('Deleted successfully!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    const editPassword = (id) => {
        console.log("Editing ", id);
        setform({ ...passwordArray.filter(item => item.id === id)[0], id: id });
        setPasswordArray(passwordArray.filter(item => item.id != id));
    };

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                theme="light"
                transition:Bounce
            />
            <div className="absolute top-0 -z-10 h-full w-full bg-white flex items-start justify-center">
                <div className="h-[500px] w-[500px] rounded-full bg-[rgba(82,248,207,0.5)] opacity-50 blur-[80px]"></div>
            </div>

            <div className="myContainer">
                <h1 className='text-4xl font-bold text-center'>
                    <span className='text-green-500'> &lt;</span>
                    <span>Pass</span>
                    <span className='text-green-500'>OP</span>
                    <span className='text-green-500'>/ &gt;</span>
                </h1>
                <p className="text-green-900 text-lg text-center">Password Manager Lite Min</p>

                <div className="text-black flex flex-col gap-3 items-center">
                    <input value={form.site} onChange={handleChange} placeholder="Enter Website URL" className="rounded-full border border-green-400 w-full p-4 py-1" type="text" name="site" />
                    <div className="flex w-full gap-3 justify-between">
                        <input value={form.username} onChange={handleChange} placeholder="Enter Username" className="rounded-full border border-green-400 w-full p-4 py-1" type="text" name="username" />
                        <div className="relative justify-item-center">
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder="Enter Password" className="rounded-full border border-green-400 w-full p-4 py-1" type="password " name="password" />
                            <span className='absolute right-1.5 top-0.5 opacity-50 cursor-pointer' onClick={showPassword}>
                                <img ref={ref} width={30} src="icons/password_show.png" alt="Eye" />
                            </span>
                        </div>
                    </div>

                    <button onClick={savePassword} className='flex justify-center items-center bg-green-400 hover:bg-green-500 rounded-full pl-4 pr-7 py-1 w-fit'>
                        <img width={40} src="icons/add.png" alt="Add Button" />
                        Add Password
                    </button>
                </div>

                <div className="passwords">
                    <h2 className='font-bold py-4 text-2xl'>Passwords</h2>
                    {passwordArray.length === 0 && <div>No passwords to show</div>}
                    {passwordArray.length != 0 &&
                        <table className="table-auto w-full rounded-md overflow-hidden">
                            <thead className='bg-green-800 text-white'>
                                <tr>
                                    <th className='py-2'>Website</th>
                                    <th className='py-2'>Username</th>
                                    <th className='py-2'>Password</th>
                                    <th className='py-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-100'>
                                {passwordArray.map((item, index) => {
                                    return <tr key={index}>
                                        <td className='text-center py-1 w-32'><a href={item.site}>{item.site}</a></td>
                                        <td className='text-center py-1 w-32'>
                                            <div className='flex justify-center items-center'>
                                                <span className='pr-2'>
                                                    {item.username}
                                                </span>
                                                <img onClick={() => { copyText(item.username) }} className="cursor-pointer w-8" src="icons/copy.png" alt="Copy" />
                                            </div>
                                        </td>
                                        <td className='text-center py-1 w-32'>
                                            <div className='flex justify-center items-center'>
                                                <span className='pr-2'>
                                                    {item.password}
                                                </span>
                                                <img onClick={() => { copyText(item.password) }} className="cursor-pointer w-8" src="icons/copy.png" alt="Copy" />
                                            </div>
                                        </td>
                                        <td className='text-center py-1 w-32'>
                                            <div className='flex justify-center items-center gap-4'>
                                                <img onClick={() => editPassword(item.id)} className="cursor-pointer w-5" src="icons/edit.png" alt="Copy" />
                                                <img onClick={() => deletePassword(item.id)} className="cursor-pointer w-5" src="icons/delete.png" alt="Copy" />
                                            </div>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>}
                </div>
            </div>
        </>
    )
}

export default Manager;