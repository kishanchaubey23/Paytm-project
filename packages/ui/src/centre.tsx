import React from "react"
export const Centre =({children}:{children:React.ReactNode})=>{
    return <div className="flex justify-centre flex-col h-full">
        <div className="flex justify-centre">
            {children}
        </div>
    </div>
}