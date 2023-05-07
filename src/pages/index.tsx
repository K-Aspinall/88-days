import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { api, type RouterOutputs } from "~/utils/api";
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import Image from "next/image";
import { type SetStateAction, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import type { EventSourceInput } from "@fullcalendar/core";
import { type DateValueType } from "react-tailwindcss-datepicker/dist/types";
import type { RefetchOptions, RefetchQueryFilters, QueryObserverResult } from "@tanstack/react-query";
import { toast } from "react-hot-toast"

type TimeWorkedWithUser = RouterOutputs["work"]["getAll"][number];
type RefectType = <TPageData>(options?: RefetchOptions & RefetchQueryFilters<TPageData>) => Promise<QueryObserverResult<unknown, unknown>>;

dayjs.extend(relativeTime)


const UserHeader = () => {
  const { user } = useUser();
  if (!user) return null;

  return <div className="flex justify-between w-full">
    <Image
      className="h-14 w-14 rounded-full"
      src={user.profileImageUrl}
      alt="Profile Image"
      width={56}
      height={56}
    />
    <h1>88 Days</h1>
    <div className="flex gap-3">
      <SignOutButton />
    </div>

  </div>
}

const CreateTimeWorked = (props: { refetch: RefectType }) => {
  const [dateRange, setDateRange] = useState<DateValueType>({
    startDate: null,
    endDate: null
  });
  const [notes, setNotes] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [valid, setValid] = useState<boolean>(false);

  const handleValueChange = (newValue: SetStateAction<DateValueType>) => {
    setDateRange(newValue);
  }

  const { user } = useUser();
  const { mutate } = api.work.create.useMutation({
    async onSettled() {
      await api.useContext().work.invalidate()
      toast.success("New work log stored!")
    }
  });

  // Create new timeWorked request & reset datepicker
  const handleMutate = () => {
    mutate({ status: valid, start: dayjs(dateRange?.startDate).toDate(), end: dayjs(dateRange?.endDate).toDate(), location: location ?? "UNKNOWN", notes: notes })
    setDateRange({ startDate: null, endDate: null })
    setNotes("")
    setLocation("")
    void props.refetch()
  }


  if (!user) return null;

  return (
    <div className="flex items-center w-full gap-3 p-4 bg-blue-50 rounded-lg mobile:flex-col sm:flex-row">
      <p className="font-bold text-lg">Log time worked</p>
      <div className="flex w-full gap-3 mobile:flex-col sm:flex-row">
        <Datepicker
          value={dateRange}
          onChange={handleValueChange}
          showShortcuts={false}
          useRange={false}
          separator="to"
          displayFormat={"DD/MM/YYYY"}
          readOnly={false}
        />
        <input className="w-full py-2 px-4 rounded-md bg-white outline-none"
          placeholder="Add Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)} />
        <input className="w-full py-2 px-4 rounded-md bg-white outline-none"
          placeholder="Add any extra details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)} />
        <div className="flex flex-column items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" onChange={() => setValid(!valid)} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
          <span className="ml-3 text-sm font-medium dark:text-gray-300">Valid</span>
        </div>
        <button
          className="enabled:bg-blue-500 enabled:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:cursor-not-allowed disabled:bg-blue-200"
          onClick={() => handleMutate()}
          disabled={(dateRange == null || dateRange.startDate == null || dateRange.endDate == null || location == undefined)}>
          Log
        </button>
      </div>
    </div>
  );
};

const TimeRemainingView = () => {
  const { data, isLoading } = api.work.getValidTime.useQuery()

  if (isLoading) return <div>{"Loading..."}</div>

  if (!data) return <div>{"No data found :("}</div>

  const DAYS_REQUIRED = 88
  const daysRemaining = DAYS_REQUIRED - data.days
  return (
    <div className="flex w-full p-6 gap-6 mobile:flex-col sm:flex-row justify-center align-middle items-center">
      <div className="flex w-full flex-col gap-6 justify-center align-middle">
        <h1 className="font-bold text-center">Days worked:</h1>
        <span className="text-black font-bold text-3xl w-full text-center">{data.days}</span>
      </div>
      <div className="flex w-full flex-col gap-6 justify-center align-middle">
        <h1 className="font-bold text-center">Days remaining:</h1>
        <span className="text-black font-bold text-3xl w-full text-center">{daysRemaining}</span>
      </div>
    </div>
  )
}

const EditDialog = (props: TimeWorkedWithUser) => {
  const dialogId = `${props.timeWorked.id}-dialog`
  return (
    <dialog id={dialogId} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <form>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
              First Name
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
            <p className="text-red-500 text-xs italic">Please fill out this field.</p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
              Last Name
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe" />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
              Password
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="******************" />
            <p className="text-gray-600 text-xs italic">Make it as long and as crazy as youd like</p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
              City
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="Albuquerque" />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
              State
            </label>
            <div className="relative">
              <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
                <option>New Mexico</option>
                <option>Missouri</option>
                <option>Texas</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
              Zip
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" placeholder="90210" />
          </div>
        </div>
        <input type="text" />
        <button formMethod="dialog" type="submit">Cancel</button>
        <button type="submit">Submit</button>
      </form>
    </dialog>)
}

const TimeWorkedToggleView = (props: { request: string, refetch: RefectType }) => {
  const { mutate } = api.work.delete.useMutation({
    async onSettled() {
      await api.useContext().work.invalidate()
      toast.success("Work log deleted.")
    }
  });

  const dialog = document.querySelector("dialog")

  dialog?.addEventListener("click", e => {
    const dialogDimensions = dialog.getBoundingClientRect()
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      dialog.close()
    }
  })

  const handleEdit = () => {
    dialog?.showModal() // Opens a modal
    void props.refetch()
  }

  const handleDelete = () => {
    mutate({ requestId: props.request })
    void props.refetch()
  }


  return (
    <div className="flex flex-row gap-3">

      <button
        className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-2 px-4 rounded"
        onClick={() => handleEdit()}>
        Edit
      </button>
      <button
        className="bg-red-300 hover:bg-red-500 text-black font-bold py-2 px-4 rounded"
        onClick={() => handleDelete()}>
        Delete
      </button>
    </div>
  )
}


const TimeWorkedView = (props: TimeWorkedWithUser & { refetch: RefectType }) => {
  const { timeWorked, refetch } = props
  return (
    <div className={`flex w-full p-4 gap-5 border-slate-400 items-center ${timeWorked.status ? "bg-green-50 rounded-lg" : ""}`} key={timeWorked.id}>
      <div className="flex w-full sm:flex-row justify-between items-center mobile:flex-col">
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full sm:flex-row mobile:flex-col">
            <span>{`${dayjs(timeWorked.begining).format("DD/MM")}`}</span>
            <span> - </span>
            <span>{`${dayjs(timeWorked.end).format("DD/MM")}`}</span>
          </div>
          <span>{timeWorked.notes}</span>
        </div>
        <TimeWorkedToggleView request={timeWorked.id} refetch={refetch} />
      </div>
    </div>
  )
}

const TimeWorkedFeed = (props: { timeouts: TimeWorkedWithUser[], refetch: RefectType }) => {
  const { timeouts, refetch } = props

  return <div className="flex w-full sm:flex-row mobile:flex-col gap-6 justify-between">
    {/* Valid Work Row */}
    <div className="flex w-4/5 flex-col gap-4">
      <p className="font-bold text-lg">Work that counts:</p>
      {timeouts.filter(x => x.timeWorked.status).map((fullRequest) =>
        <TimeWorkedView {...fullRequest} key={fullRequest.timeWorked.id} refetch={refetch} />
      )}
    </div>
    {/* Invalid Work Row */}
    <div className="flex w-full flex-col gap-4">
      <p className="font-bold text-lg">Other work:</p>
      {timeouts.filter(x => !x.timeWorked.status).map((fullRequest) =>
        <TimeWorkedView {...fullRequest} key={fullRequest.timeWorked.id} refetch={refetch} />
      )}
    </div>

  </div>
}

const EventSourceForUser = (timeWorkeds: TimeWorkedWithUser[]): EventSourceInput => {
  // For some reason all these dates need to be re-assigned to a date object ot function correctly?
  console.log(timeWorkeds)
  const events = timeWorkeds.map(x => {
    return {
      title: x.user.username + `${x.timeWorked.notes ? (" - " + x.timeWorked.notes) : ""}`,
      start: dayjs(new Date(x.timeWorked.begining)).format('YYYY-MM-DD'),
      // Add day to calander display as should be inclusive
      end: dayjs(new Date(x.timeWorked.end)).add(1, 'day').format('YYYY-MM-DD'),
      description: x.timeWorked.notes,
      borderColor: !x.timeWorked.status ? "black" : undefined,
      backgroundColor: !x.timeWorked.status ? "white" : undefined,
    }
  })
  console.log(events)
  return {
    events: [ // put the array in the `events` property
      ...events
    ],
    //color: color,     // an option!
    textColor: 'black' // an option!
  }
}

const DisplayCalander = (props: { timeouts: TimeWorkedWithUser[] }) => {
  const eventSource = EventSourceForUser(props.timeouts)

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      eventSources={[
        eventSource,
      ]}
    />
  )
}

const DisplayBody = () => {
  // Start fetching asap
  const { data, isLoading: requestsLoading, refetch } = api.work.getAll.useQuery(undefined, { staleTime: 3000, });

  if (requestsLoading) return <div>{"Loading..."}</div>

  if (!data) return <div>{"No data found :("}</div>

  return (
    <div className="h-full w-full md:max-w-6xl flex flex-col gap-5 p-4">
      <CreateTimeWorked refetch={refetch} />
      <TimeRemainingView />
      <DisplayCalander timeouts={data} />
      <TimeWorkedFeed timeouts={data} refetch={refetch} />
      <div className="p-4"></div>
    </div>
  )
}


const Home: NextPage = () => {

  const { isLoaded: userLoaded, isSignedIn } = useUser();
  // Return empty if div if not loadaed
  if (!userLoaded) return <div />

  return (
    <>
      <Head>
        <title>88-Days</title>
        <meta name="description" content="Work tracking for 88 days" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full md:max-w-6xl flex flex-col gap-5 p-4">
          <div className=" p-4 text-2xl text-slate-500">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton mode="modal">
                  <button className="btn">Sign in</button>
                </SignInButton>
              </div>
            )}
            {!!isSignedIn && <UserHeader />}
          </div>
          {!!isSignedIn && <DisplayBody />}
        </div>
      </main>
    </>
  );
};

export default Home;
