import React, { useEffect, useState } from "react";
import axios from "axios";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import { Droplet, ScanFace, Eye, User } from "lucide-react";

import "react-vertical-timeline-component/style.min.css";
import { format } from "date-fns";

import { SkinHistoryEntry } from "@/types/SkinHistoryEntry";
import SkinHealthGauge from "@/component/UI/SkinHealthGauge";
import AccurateSkinHealthGauge from "@/component/UI/AccurateSkinHealthGauge";
import { useNavigate } from "react-router-dom";

const ProgressTracking: React.FC = () => {
  const [entries, setEntries] = useState<SkinHistoryEntry[]>([]);
 const navigate = useNavigate();
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get<SkinHistoryEntry[]>(`${import.meta.env.VITE_API_BACKEND_URL}/skin-history/user/progress`, {
          withCredentials: true,
        });
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching progress tracking data:", error);
      }
    };

    fetchProgress();
  }, []);

 return (
    <div className="py-12 px-4 md:px-16 shadow-md rounded-lg bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-14">
        Skin Progress Timeline
      </h2>

      <VerticalTimeline animate={true} lineColor="#d1d5db">
        {Array.isArray(entries) ? (
          entries.map((entry, index) => {
            const alt = index % 2 === 0;
            const skinHealth = {
              classifications: entry.classifications,
              detections: entry.detections,
            };
            return (
              <VerticalTimelineElement
                
  icon={<ScanFace size={20} />}
                key={entry._id}
            date={format(new Date(entry.analyzedAt), 'PP, hh:mm a')}

                contentStyle={{
                  background: alt ? '#f0ffff' : '#ffffff',
                  color: '#1f2937',
                  borderRadius: '1rem',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                }}
                contentArrowStyle={{
                  borderRight: `7px solid ${alt ? '#f0f4f8' : '#ffffff'}`,
                }}
                iconStyle={{
                  background: alt ? '#FF69B4' : '#000000',
                  color: '#fff',
                }}
              >
                <div className="flex flex-col gap-4  shadow-lg"   onClick={() => navigate(`${entry._id}`)}>
                  <img
                    src={entry.scanned_image_after || entry.scanned_image_before}
                    alt="Scanned"
                    className="rounded-xl w-full h-52 object-cover shadow-sm"
                  />
                  <div className="text-sm space-y-1">
                    <p className=" capitalize">
                      <strong>Skin Type:</strong>{' '}
                      {entry.classifications.skin_type?.label ?? 'N/A'}
                    </p>
                    <p>
                      <strong>Acne Severity:</strong>{' '}
                      {entry.classifications.acne_severity?.label ?? 'N/A'}
                    </p>
                    <p>
                      <strong>Puffy Eyes:</strong>{' '}
                      {entry.detections.puffy_eyes?.objects.length ?? 0}
                    </p>
                  </div>
                  <AccurateSkinHealthGauge   detections={entry.detections}
  classifications={entry.classifications}          />
                </div>
              </VerticalTimelineElement>
            );
          })
        ) : (
          <div className="text-center text-gray-500">No entries found.</div>
        )}
      </VerticalTimeline>
    </div>
  );

};

export default ProgressTracking;
