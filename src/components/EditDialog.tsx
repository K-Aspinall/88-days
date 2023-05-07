import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { type SetStateAction, useState, type Dispatch } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { type DateValueType } from "react-tailwindcss-datepicker/dist/types";
import { type TimeWorked } from "@prisma/client";
import React from "react";


const EditDialog = (props: TimeWorked & { setTimeworked: Dispatch<SetStateAction<TimeWorked>> }) => {
    const [dateRange, setDateRange] = useState<DateValueType>({
        startDate: props.begining,
        endDate: props.end
    });
    const [notes, setNotes] = useState<string | undefined>(props.notes ?? undefined);
    const [location, setLocation] = useState<string | undefined>(props.location);
    const [valid, setValid] = useState<boolean>(props.status);

    const handleValueChange = (newValue: SetStateAction<DateValueType>) => {
        setDateRange(newValue);
    }

    const dialogId = `${props.id}-dialog`
    return (
        <dialog id={dialogId} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <form>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor={`${dialogId}-grid-first-name`}>
                            Begining
                        </label>
                        {/* <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id={`${dialogId}-grid-first-name`}
                            type="text"
                            placeholder="Jane" /> */}
                        <div id={`${dialogId}-grid-first-name`}>
                            <Datepicker
                                value={dateRange}
                                onChange={handleValueChange}
                                showShortcuts={false}
                                useRange={false}
                                separator="to"
                                displayFormat={"DD/MM/YYYY"}
                                readOnly={false}
                            />
                        </div>

                        <p className="text-red-500 text-xs italic">Please fill out this field.</p>
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-last-name">
                            End
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-last-name"
                            type="text"
                            placeholder="Doe" />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor={`${dialogId}-grid-password`}>
                            Password
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id={`${dialogId}-grid-password`}
                            type="password"
                            placeholder="******************" />
                        <p className="text-gray-600 text-xs italic">Make it as long and as crazy as youd like</p>
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor={`${dialogId}-grid-city`}>
                            City
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id={`${dialogId}-grid-city`}
                            type="text"
                            placeholder="Albuquerque" />
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor={`${dialogId}-grid-state`}>
                            State
                        </label>
                        <div className="relative">
                            <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id={`${dialogId}-grid-state`}>
                                <option>New Mexico</option>
                                <option>Missouri</option>
                                <option>Texas</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20">
                                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor={`${dialogId}-grid-zip`}>
                            Zip
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id={`${dialogId}-grid-zip`}
                            type="text"
                            placeholder="90210" />
                    </div>
                </div>
                <button formMethod="dialog" type="submit">Cancel</button>
                <button className="enabled:bg-blue-500 enabled:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed disabled:bg-blue-200"
                    type="submit"
                    disabled={(dateRange == null || dateRange.startDate == null || dateRange.endDate == null || location == undefined)}>
                    Edit
                </button>
            </form>
        </dialog>)
}

export default EditDialog