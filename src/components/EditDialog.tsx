import { type SetStateAction, useState, type Dispatch } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { type DateValueType } from "react-tailwindcss-datepicker/dist/types";
import { type TimeWorked } from "@prisma/client";
import React from "react";

export type EditDialogProps = {
    timeWorked: TimeWorked,
    handleSubmit: (data: TimeWorked) => void
    onClose: () => void,
}

const EditDialogContent = ({ timeWorked, handleSubmit, onClose }: EditDialogProps) => {
    const [dateRange, setDateRange] = useState<DateValueType>({
        startDate: timeWorked.begining,
        endDate: timeWorked.end
    });
    const [notes, setNotes] = useState<string | undefined>(timeWorked.notes ?? undefined);
    const [location, setLocation] = useState<string | undefined>(timeWorked.location);
    const [valid, setValid] = useState<boolean>(timeWorked.status);

    const handleValueChange = (newValue: SetStateAction<DateValueType>) => {
        setDateRange(newValue);
    }

    const onSubmit = () => {
        handleSubmit(timeWorked)
    }

    return (
        <form>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor={`dialog-grid-first-name`}>
                        Begining
                    </label>
                    {/* <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            id={`dialog-grid-first-name`}
                            type="text"
                            placeholder="Jane" /> */}
                    <div id={`dialog-grid-first-name`}>
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
                        htmlFor={`dialog-grid-location`}>
                        Location
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id={`dialog-grid-location`}
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)} />
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor={`dialog-grid-notes`}>
                        Notes
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id={`dialog-grid-notes`}
                        type="text"
                        value={notes}
                        placeholder="Any extra details..."
                        onChange={(e) => setNotes(e.target.value)} />
                </div>
                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <div className="flex flex-column items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" onChange={() => setValid(!valid)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                        <span className="ml-3 text-sm font-medium dark:text-gray-300">Valid</span>
                    </div>
                </div>
            </div>
            <button formMethod="dialog" type="submit" onClick={onClose}>Cancel</button>
            <button className="enabled:bg-blue-500 enabled:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed disabled:bg-blue-200"
                type="submit"
                onClick={onSubmit}
                disabled={(dateRange == null || dateRange.startDate == null || dateRange.endDate == null || location == undefined)}>
                Edit
            </button>
        </form>
    )
}

export default EditDialogContent