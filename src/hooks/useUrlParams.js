import { useSearchParams } from "react-router-dom";

function useUrlParams() {
  const [searchParams] = useSearchParams();
}
