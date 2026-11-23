import {
  DevicesRounded,
  ListAltRounded,
  SortRounded,
} from "@mui/icons-material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Image from "next/image";
import Link from "next/link";

export default function page() {
  return (
    <div className="bg-slate-50 text-slate-600">
      <Navbar />
      <CTASection />
      <Features />
    </div>
  );
}

function CTASection() {
  return (
    <div className="flex flex-col mx-16 items-center mt-[120px] gap-6">
      {/*  */}
      <h2 className="font-bold text-2xl text-center">
        Manage Your Projects and Tasks
      </h2>
      <span className={`text-orange-600`}>Effortlessly!</span>
      {/*  */}
      <p className="text-center text-[15px]">
        Take full control of your projects today - start adding tasks, sorting
        your priorities, and tracking progress with ease. Stay organized and
        boost your productivity effortlessly!
      </p>

      <Link
        href="/"
        className={`block bg-orange-600 rounded-md px-9 py-3 text-sm font-medium text-white hover:bg-orange-500 cursor-pointer `}
        type="button"
      >{`Let's get started!`}</Link>

      <Image
        src={"/app.png"}
        alt="dashboard"
        width={900}
        height={400}
        className="shadow-xl mt-9 aspect-auto w-[390px] rounded-lg max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl"
      />
    </div>
  );
}

function Features() {
  const features = [
    {
      id: 4,
      name: "Seamless Project and Task Management",
      icon: <ListAltRounded className="text-orange-600 text-[32px]" />,
      description: `Create, edit, and delete projects and tasks with ease. Use sorting, filtering, and tabs to keep your wor work organised`,
    },
    {
      id: 5,
      name: "Dynamic Interface with Responsive Design",
      icon: <DevicesRounded className="text-orange-600 text-[32px]" />,
      description: `Navigate through a responsive dashboard and task pages that adapt to any screen size. Open and close windows for editing the tasks and the projects.`,
    },
    {
      id: 6,
      name: "Advanced Task Sorting and Progress Tracking",
      icon: <SortRounded className="text-orange-600 text-[32px]" />,
      description: `Track ongoing and completed tasks, switch between tabs, and sort tasks or projects based on status, name and date.`,
    },
  ];
  return (
    <section className="py-12 bg-slate-50 mt-12 px-9">
      <div className="mx-auto px-4">
        <h2 className="text-2xl font-bold text-center">Key Features</h2>
        {/*  */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 px-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-sm flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full items-center justify-center flex bg-orange-100">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-orange-600 mt-6 text-center">
                {feature.name}
              </h3>
              <p className="text-slate-600 text-[13px] mt-2 text-center w-[80%]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Navbar() {
  return (
    <nav className="flex p-7 max-sm:mt-9 items-center justify-between max-sm:flex-col">
      <Logo />
      <Buttons />
    </nav>
  );
}

function Logo() {
  return (
    <div>
      {/* Icon Container*/}
      {/* Icon*/}
      <TaskAltIcon sx={{ fontSize: 34 }} className="text-orange-600" />

      {/*App Name*/}
      <div className="flex gap-1 text-[22px]">
        <span className={`font-bold text-orange-600`}>Project</span>
        <span className="text-slate-600">Master</span>
      </div>
    </div>
  );
}

function Buttons() {
  return (
    <div>
      <Link
        href="/dashboard"
        className="bg-orange-600 p-2 px-4 rounded-lg text-slate-50 hover:opacity-85 cursor-pointer border-none"
      >
        Dashboard
      </Link>
    </div>
  );
}
