export class Departure {
  expectedArrivalTime: Date;
  serviceJourney: { journeyPattern: { line: { id: string, name: string, transportMode: string } } };
  arrival: string;
  aimedArrivalTime: Date;
  destinationDisplay: { frontText: string };
  bussNumber: string;
  quary: { id: string; publicCode: string; name: string; description: string };
}
