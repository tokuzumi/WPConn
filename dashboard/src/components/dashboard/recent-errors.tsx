"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CriticalError } from "@/services/api";
import { AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecentErrorsProps {
    data: CriticalError[];
}

export function RecentErrors({ data }: RecentErrorsProps) {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Últimos Erros Críticos</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                        {data.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">Nenhum erro crítico recente.</p>
                        ) : (
                            data.map((error) => (
                                <div key={error.id} className="flex items-start space-x-4 rounded-md border p-3">
                                    <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {error.tenant_name} - {error.event}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {error.detail}
                                        </p>
                                        <p className="text-xs text-muted-foreground pt-1">
                                            {new Date(error.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
