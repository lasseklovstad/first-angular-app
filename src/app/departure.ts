export class Departure {
  expectedArrivalTime: Date;
  serviceJourney: { journeyPattern: { line: { id: string, name: string, transportMode: string } } };
  arrival: string;
  aimedArrivalTime: Date;
  destinationDisplay: { frontText: string };
  bussNumber: string;
}
