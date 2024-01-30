import { z } from "zod";

export const SessionInputZSchema = z.object({
  countryCode: z.string(),
  destination: z.object({
    placeId: z.string().optional(),
    destination: z.string().optional(),
    dest_type: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
  checkInDate: z.string().pipe(z.coerce.date()),
  checkOutDate: z.string().pipe(z.coerce.date()),
  rooms: z.number(),
  adult: z.number(),
  children: z.number(),
  childrenAges: z.array(z.number()),
  guests: z.string().optional(),
});

export type SessionInputDto = z.infer<typeof SessionInputZSchema>;
