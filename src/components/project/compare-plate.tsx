import Image from "next/image";

export interface ComparePane {
  readonly src: string;
  readonly alt: string;
  readonly state: string;
  readonly readout: string;
  readonly width: number;
  readonly height: number;
}

interface ComparePlateProps {
  before: ComparePane;
  after: ComparePane;
  caption: string;
}

/** Two photographs of the same scene, before and after, side by side with their readouts. */
export const ComparePlate = ({ before, after, caption }: ComparePlateProps) => (
  <figure className="fp" data-p="mute">
    <div className="cmp">
      {[before, after].map((pane) => (
        <div key={pane.state}>
          <p>
            <span data-c="acc">{pane.state}</span> <span data-c="mute">{pane.readout}</span>
          </p>
          <Image src={pane.src} alt={pane.alt} width={pane.width} height={pane.height} />
        </div>
      ))}
    </div>
    <figcaption data-c="mute">{caption}</figcaption>
  </figure>
);
