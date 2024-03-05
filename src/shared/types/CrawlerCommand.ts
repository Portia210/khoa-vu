import { z } from "zod";

export const CrawlerCommandZSchema = z.object({
  _id: z.string().optional(),
  dataSource: z.string().optional(), // Travelor or Booking
  countryCode: z.string(),
  destination: z.object({
    placeId: z.string().optional(),
    destination: z.string().optional(),
    dest_type: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
  rooms: z.number().optional(),
  adult: z.number().optional(),
  children: z.number().optional(),
  childrenAges: z.array(z.number()).optional(),
  guests: z.string().optional(),
  status: z.string().optional().default("PENDING"),
  message: z.any().optional(),
  assignedTo: z.string().optional(),
});

export type CrawlerCommand = z.infer<typeof CrawlerCommandZSchema>;