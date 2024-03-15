/* eslint-disable prettier/prettier */
export interface MessageDto {
    sender_id: string;
    receiver_id: string;
    content: string;
    image: string[];
    video: string[];
    file: string
}