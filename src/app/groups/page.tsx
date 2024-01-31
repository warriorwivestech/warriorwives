import React from "react";
import GroupCard from "../components/GroupCards";
import { Divider, SimpleGrid } from "@chakra-ui/react";

export default function GroupPage() {
  const sampleGroupData = [
    {
      id: 1,
      name: "Alpha Team",
      description: "Special Operations Unit",
      displayPhoto:
        "https://t4.ftcdn.net/jpg/03/40/52/49/360_F_340524914_pzOWCq4I0WjytxaW8DTVFujrck1gjvvO.jpg",
      branchOfService: "Army",
      county: "XYZ County",
      state: "California",
      online: true,
      members: [],
      tags: ["Special Operations", "Tactical", "Alpha"],
      events: [],
    },
    {
      id: 2,
      name: "Bravo Squadron",
      description: "Air Support Division",
      displayPhoto:
        "https://media.istockphoto.com/id/1370858710/photo/portrait-of-cheerful-mixed-age-range-multi-ethnic-women-celebrating-international-womens-day.jpg?s=612x612&w=0&k=20&c=ViS40J0LzPTcfv-o_bbkDehpdKbC8q-250RD02wmb8c=",
      branchOfService: "Air Force",
      county: "ABC County",
      state: "Texas",
      online: false,
      members: [],
      tags: ["Air Support", "Aviation", "Bravo"],
      events: [],
    },
    {
      id: 3,
      name: "Delta Division",
      description: "Naval Operations",
      displayPhoto:
        "https://media.istockphoto.com/id/951541912/photo/happiness-happens-when-we-stand-together.jpg?s=612x612&w=0&k=20&c=R1qXpX5S-LA4UyEskrvDnL_ufl_9Qdn656NxwgEMLJ4=",
      branchOfService: "Navy",
      county: "PQR County",
      state: "Florida",
      online: true,
      members: [],
      tags: ["Naval", "Maritime", "Delta"],
      events: [],
    },
    {
      id: 4,
      name: "Ranger Squad",
      description: "Elite Infantry Unit",
      displayPhoto:
        "https://media.istockphoto.com/id/1480574582/photo/happy-multigenerational-group-of-women-with-different-ages-and-ethnicities-having-fun-in-a.webp?b=1&s=170667a&w=0&k=20&c=hWNjOWWoiAdq9OLaX4mYfx2rlyQM9CYYfS8aPO6srGY=",
      branchOfService: "Army",
      county: "",
      state: "National",
      online: false,
      members: [],
      tags: ["Infantry", "Special Forces", "Ranger", "Test", "Test", "Test"],
      events: [],
    },
    {
      id: 5,
      name: "Echo Company",
      description: "Communication and Technology",
      displayPhoto:
        "https://media.istockphoto.com/id/951541912/photo/happiness-happens-when-we-stand-together.jpg?s=612x612&w=0&k=20&c=R1qXpX5S-LA4UyEskrvDnL_ufl_9Qdn656NxwgEMLJ4=",
      branchOfService: "Army",
      county: "JKL County",
      state: "National",
      online: true,
      members: [],
      tags: ["Communication", "Technology", "Echo"],
      events: [],
    },
  ];

  return (
    <div className='flex flex-col gap-12'>
      <div className='flex flex-col gap-6'>
        <p className='text-heading4'>My Groups</p>
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {sampleGroupData.map((group, index) => {
            return <GroupCard key={index} {...group} />;
          })}
        </SimpleGrid>
      </div>
      <Divider />
      <div className='flex flex-col gap-6'>
        <p className='text-heading3'>Groups you might be interested in</p>
        <div className='flex flex-row gap-8 overflow-scroll overflow-y-hidden'>
          {sampleGroupData.map((group, index) => {
            return (
              <div key={index} className='min-w-[330px] sm:min-w-[500px] mb-4'>
                <GroupCard {...group} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
