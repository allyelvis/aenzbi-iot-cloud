
"use client";
import React, { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wrench, Zap, ShieldCheck, Activity, AlertTriangle } from "lucide-react";
import type { PredictEquipmentFailureInput, PredictEquipmentFailureOutput } from '@/ai/flows/predict-equipment-failure';
import { getPrediction } from './actions';
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MaintenanceRecord } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

const initialMaintenanceRecords: MaintenanceRecord[] = [
  { id: "maint_001", equipmentId: "EQP-001", equipmentName: "Excavator X1", equipmentType: "Heavy Machinery", status: "Healthy", lastCheckDate: new Date(Date.now() - 86400000 * 5).toISOString(), nextCheckDate: new Date(Date.now() + 86400000 * 25).toISOString() },
  { id: "maint_002", equipmentId: "EQP-002", equipmentName: "Crane C3", equipmentType: "Heavy Machinery", status: "Needs Check", lastCheckDate: new Date(Date.now() - 86400000 * 30).toISOString(), nextCheckDate: new Date().toISOString() },
  { id: "maint_003", equipmentId: "PMP-102", equipmentName: "Concrete Pump P-102", equipmentType: "Pump", status: "Maintenance Required", lastCheckDate: new Date(Date.now() - 86400000 * 2).toISOString(), prediction: { predictedFailure: true, failureReason: "High vibration patterns detected", recommendedActions: "Inspect motor bearings and alignment.", confidenceLevel: 0.85 } },
];

const statusVariantMap: Record<MaintenanceRecord['status'], "default" | "secondary" | "destructive" | "outline"> = {
  Healthy: "default", // Green
  "Needs Check": "outline", // Yellow/Orange
  "Maintenance Required": "destructive", // Red
  Critical: "destructive", // Dark Red
};

const statusColorMap: Record<MaintenanceRecord['status'], string> = {
  Healthy: "bg-green-500 hover:bg-green-600",
  "Needs Check": "bg-yellow-500 hover:bg-yellow-600",
  "Maintenance Required": "bg-orange-500 hover:bg-orange-600",
  Critical: "bg-red-600 hover:bg-red-700",
};


export default function MaintenancePage() {
  const [formData, setFormData] = useState<PredictEquipmentFailureInput>({
    equipmentType: "",
    vibrationData: "",
    temperatureData: "",
    historicalMaintenanceRecords: "",
  });
  const [predictionResult, setPredictionResult] = useState<PredictEquipmentFailureOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(initialMaintenanceRecords);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPredictionResult(null);
    try {
      const result = await getPrediction(formData);
      setPredictionResult(result);
      // Potentially update maintenanceRecords based on this prediction
      const existingRecord = maintenanceRecords.find(rec => rec.equipmentName.toLowerCase().includes(formData.equipmentType.toLowerCase().split(" ")[0])); // simple match
      if (existingRecord && result.predictedFailure) {
        setMaintenanceRecords(prevRecords => prevRecords.map(rec => rec.id === existingRecord.id ? {
          ...rec,
          status: result.confidenceLevel > 0.8 ? "Critical" : "Maintenance Required",
          prediction: result,
          lastCheckDate: new Date().toISOString()
        } : rec));
      }

    } catch (error) {
      console.error("Prediction error:", error);
      setPredictionResult({
        predictedFailure: false,
        failureReason: "An error occurred during prediction.",
        recommendedActions: "Please check the input data and try again.",
        confidenceLevel: 0,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Predictive Maintenance"
        description="Analyze sensor data to predict equipment failures and schedule maintenance proactively."
        icon={Wrench}
      />

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">Predict Failure</CardTitle>
            <CardDescription className="font-body">Enter equipment data to get a failure prediction.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="equipmentType" className="font-body">Equipment Type</Label>
                <Input id="equipmentType" name="equipmentType" value={formData.equipmentType} onChange={handleChange} placeholder="e.g., Excavator, Pump" required />
              </div>
              <div>
                <Label htmlFor="vibrationData" className="font-body">Vibration Data (JSON/CSV or text)</Label>
                <Textarea id="vibrationData" name="vibrationData" value={formData.vibrationData} onChange={handleChange} placeholder="Paste sensor readings" rows={3} required/>
              </div>
              <div>
                <Label htmlFor="temperatureData" className="font-body">Temperature Data (JSON/CSV or text)</Label>
                <Textarea id="temperatureData" name="temperatureData" value={formData.temperatureData} onChange={handleChange} placeholder="Paste sensor readings" rows={3} required/>
              </div>
              <div>
                <Label htmlFor="historicalMaintenanceRecords" className="font-body">Historical Maintenance (Optional)</Label>
                <Textarea id="historicalMaintenanceRecords" name="historicalMaintenanceRecords" value={formData.historicalMaintenanceRecords || ""} onChange={handleChange} placeholder="e.g., Last serviced: 2023-01-15" rows={2}/>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {isLoading ? "Analyzing..." : "Get Prediction"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline">Prediction Result</CardTitle>
            <CardDescription className="font-body">AI-powered analysis of potential equipment failure.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <Progress value={50} className="w-full animate-pulse" />}
            {!isLoading && !predictionResult && (
              <div className="text-center text-muted-foreground py-10">
                <Zap className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p className="font-body">Submit data on the left to see prediction results here.</p>
              </div>
            )}
            {predictionResult && (
              <div className="space-y-4">
                {predictionResult.predictedFailure ? (
                  <div className="p-4 rounded-md border border-destructive bg-destructive/10">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                      <h3 className="text-xl font-semibold font-headline text-destructive">Failure Predicted</h3>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-md border border-green-500 bg-green-500/10">
                     <div className="flex items-center gap-2 mb-2">
                       <ShieldCheck className="h-6 w-6 text-green-600" />
                       <h3 className="text-xl font-semibold font-headline text-green-700">No Immediate Failure Predicted</h3>
                     </div>
                  </div>
                )}
                <div>
                  <Label className="font-body">Confidence Level</Label>
                  <div className="flex items-center gap-2">
                    <Progress value={predictionResult.confidenceLevel * 100} className="w-full h-3" />
                    <span className="text-sm font-semibold font-body">{(predictionResult.confidenceLevel * 100).toFixed(0)}%</span>
                  </div>
                </div>
                 {predictionResult.failureReason && (
                  <div>
                    <Label className="font-body">Reason</Label>
                    <p className="text-sm p-2 bg-muted rounded-md font-body">{predictionResult.failureReason}</p>
                  </div>
                 )}
                {predictionResult.recommendedActions && (
                  <div>
                    <Label className="font-body">Recommended Actions</Label>
                    <p className="text-sm p-2 bg-muted rounded-md font-body">{predictionResult.recommendedActions}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">Equipment Maintenance Status</CardTitle>
          <CardDescription className="font-body">Overview of all monitored equipment and their maintenance needs.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Check</TableHead>
                <TableHead>Next Check</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.equipmentId}</TableCell>
                  <TableCell className="font-medium">{record.equipmentName}</TableCell>
                  <TableCell>{record.equipmentType}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColorMap[record.status]} text-white`}>{record.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(record.lastCheckDate).toLocaleDateString()}</TableCell>
                  <TableCell>{record.nextCheckDate ? new Date(record.nextCheckDate).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
