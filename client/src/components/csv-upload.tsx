import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUploadCSV } from "@/hooks/use-traffic-data";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

export default function CSVUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadCSV();

  // File validation
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv' && file.type !== 'application/csv') {
      return { valid: false, error: "Please select a CSV file" };
    }
    
    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return { valid: false, error: "File size must be less than 50MB" };
    }
    
    // Check if file is empty
    if (file.size === 0) {
      return { valid: false, error: "File cannot be empty" };
    }
    
    return { valid: true };
  };

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validation = validateFile(file);
      if (validation.valid) {
        setSelectedFile(file);
      }
    }
  }, []);

  // Handle file input change
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateFile(file);
      if (validation.valid) {
        setSelectedFile(file);
      }
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90; // Stop at 90%, let actual upload complete it
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      await uploadMutation.mutateAsync(selectedFile);
      setUploadProgress(100);
      // Reset after success
      setTimeout(() => {
        setSelectedFile(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 2000);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
    }
  };

  // Clear selection
  const handleClear = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full max-w-2xl mx-auto" data-testid="csv-upload-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload CSV File
        </CardTitle>
        <CardDescription>
          Upload your traffic data CSV file for analysis with high-accuracy ML models
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* CSV Format Instructions */}
        <Alert data-testid="format-instructions">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Required CSV columns:</strong> Date, Hour, Location, Queue_Density (or Queue), 
            Stop_Density (or StopDensity), Accidents_Reported (or Accidents), Fatalities
          </AlertDescription>
        </Alert>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : selectedFile 
              ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/20'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          data-testid="upload-drop-zone"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv,application/csv"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            data-testid="file-input"
          />
          
          {!selectedFile ? (
            <>
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {dragActive ? "Drop your CSV file here" : "Drag and drop your CSV file here"}
                </p>
                <p className="text-sm text-muted-foreground">
                  or <span className="text-primary font-medium">click to browse</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Maximum file size: 50MB
                </p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-green-700 dark:text-green-400" data-testid="selected-filename">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground" data-testid="selected-filesize">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Ready
                </Badge>
              </div>
              
              {/* Upload Progress */}
              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Upload Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" data-testid="upload-progress" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {selectedFile && (
            <>
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending || uploadProgress > 0}
                className="flex-1"
                data-testid="button-upload"
              >
                {uploadMutation.isPending || uploadProgress > 0 ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-pulse" />
                    {uploadProgress < 90 ? "Uploading..." : "Processing..."}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Analyze
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={uploadMutation.isPending || uploadProgress > 0}
                data-testid="button-clear"
              >
                Clear
              </Button>
            </>
          )}
        </div>

        {/* Status Messages */}
        {uploadMutation.isError && (
          <Alert variant="destructive" data-testid="upload-error">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Upload failed:</strong> {uploadMutation.error instanceof Error ? uploadMutation.error.message : "Unknown error"}
            </AlertDescription>
          </Alert>
        )}
        
        {uploadMutation.isSuccess && uploadProgress === 100 && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20" data-testid="upload-success">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              <strong>Success!</strong> Your CSV file has been uploaded and is being processed with ML models. 
              The dashboard will update automatically when analysis is complete.
            </AlertDescription>
          </Alert>
        )}
        
        {uploadMutation.isPending && uploadProgress >= 90 && (
          <Alert data-testid="processing-status">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Processing:</strong> Running high-accuracy Python ML analysis on your data. 
              This may take a few moments...
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}