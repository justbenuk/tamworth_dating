import { Button } from "@heroui/button";
import { FaRegSmile } from "react-icons/fa";
export default function Home() {
  return (
    <div>This is the home page
      <div>
        <Button color="primary" variant="bordered" startContent={<FaRegSmile />}>Hello</Button>
      </div>
    </div>
  );
}
