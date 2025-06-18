import TitleCompo from "@/components/TitleCompo";
import axios from "axios";
import dayjs from "dayjs";
import { DashStyled } from "./styled";
import { useEffect, useState } from "react";

const DashBoard = () => {
  const [bidHistory, setBidHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [auctionData, setAuctionData] = useState<any[]>([]);

  return (
    <DashStyled>
      <TitleCompo title="대시보드" />
    </DashStyled>
  );
};
export default DashBoard;
