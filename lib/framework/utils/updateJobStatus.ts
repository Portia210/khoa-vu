import { BASE_URL } from "~lib/constants/enviroment"

const updateJobStatus = async (job: any, status = "RUNNING") => {
  try {
    if (!job._id) throw new Error("Job id is required")
    const payload = {
      ...job,
      status
    }
    const response = await fetch(`${BASE_URL}/api/jobs/${job._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then((res) => res.json())
    return response
  } catch (error) {
    console.error("Error while updating job status", error)
    throw error
  }
}

export { updateJobStatus }
