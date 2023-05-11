import dayjs from 'dayjs';

export default function formatDate(){
    return dayjs().format("YYYY-MM-DD");
}