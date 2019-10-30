/**
* @author Christopher Cook
* @copyright Webprofusion Pty Ltd https://webprofusion.com
*/

import { Logging, LogLevel } from './Logging';
import { Injectable } from '@angular/core';
import { CoreReferenceData } from '../model/CoreReferenceData';
import { HttpClient } from '@angular/common/http';
import { OperatorInfo } from '../model/CoreDataModel';
import { APIClient } from './APIClient';
import { ReferenceDataFilters } from '../model/ReferenceDataFilters';

@Injectable({
    providedIn: 'root',
})

/**
 * Manage access to OCM reference data and filtered reference (country specific etc))
 */
export class ReferenceDataManager {

    private referenceData: CoreReferenceData;
    private filteredReferenceData: CoreReferenceData;

    constructor(public http: HttpClient, public logging: Logging) {
        this.loadCachedRefData();
    }

    public refreshReferenceData(api: APIClient) {

        api.fetchCoreReferenceData(null).subscribe((res) => {
            this.setCoreReferenceData(res);
            this.setFilteredReferenceData(res);

            this.logging.log('Got refreshed core ref data.', LogLevel.VERBOSE);

            this.cacheCurrentRefData();
        }, (rejection) => {
            this.logging.log('Error fetching core ref data:' + rejection);
        });
    }

    public refreshFilteredReferenceData(api: APIClient, filters: ReferenceDataFilters) {
        api.fetchCoreReferenceData(filters).subscribe((res) => {

            this.setFilteredReferenceData(res);

            this.logging.log('Got refreshed filtered reference data.', LogLevel.VERBOSE);
        }, (rejection) => {
            this.logging.log('Error fetching filtered reference data:' + rejection);
        });
    }

    public setCoreReferenceData(refData) {
        this.referenceData = refData;
    }

    public setFilteredReferenceData(refData) {
        this.filteredReferenceData = refData;
    }

    public referenceDataLoaded(): boolean {
        if (this.referenceData != null) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get list of countries, optionally filtered to only those with data present
     * */
    public getCountries(filtered: boolean = false): Array<any> {

        if (filtered == true) {
            return this.filteredReferenceData.Countries;
        } else {
            return this.referenceData.Countries;
        }

    }

    public getCountryByID(id: number): any {
        return this.getRefDataByID(this.referenceData.Countries, id);
    }

    /**
     * Get list of connection types optionally filtered to those in use or by country usage
     */
    public getConnectionTypes(filtered: boolean = false): Array<any> {
        if (filtered == true) {
            return this.filteredReferenceData.ConnectionTypes;
        } else {
            return this.referenceData.ConnectionTypes;
        }
    }

    public getConnectionTypeByID(id: number): any {
        return this.getRefDataByID(this.referenceData.ConnectionTypes, id);
    }

    /**
    * Get list of usage types optionally filtered to those in use or by country usage
    */
    public getUsageTypes(filtered: boolean = false): Array<any> {
        if (filtered == true) {
            return this.filteredReferenceData.UsageTypes;
        } else {
            return this.referenceData.UsageTypes.filter(i => i.ID > 0);
        }
    }

    public getUsageTypeByID(id: number): any {
        return this.getRefDataByID(this.referenceData.UsageTypes, id);
    }

    /**
     * Get list of Status types optionally filtered to those in use or by country usage
     */
    public getStatusTypes(filtered: boolean = false): Array<any> {
        if (filtered == true) {
            return this.filteredReferenceData.StatusTypes;
        } else {
            return this.referenceData.StatusTypes.filter(i => i.ID > 0);
        }
    }

    public getStatusTypeByID(id: number): any {
        return this.getRefDataByID(this.referenceData.StatusTypes, id);
    }

    /**
     * Get list of Network operators optionally filtered to those in use or by country usage
     */
    public getNetworkOperators(filtered: boolean = false): Array<OperatorInfo> {
        if (filtered == true) {
            return this.filteredReferenceData.Operators;
        } else {
            return this.referenceData.Operators;
        }
    }

    public getNetworkOperatorByID(id: number): any {
        return this.getRefDataByID(this.referenceData.Operators, id);
    }

    /**
     * Get list of Data Providers optionally filtered to those in use or by country usage
     */
    public getDataProviders(filtered: boolean = false): Array<any> {
        if (filtered == true) {
            return this.filteredReferenceData.DataProviders;
        } else {
            return this.referenceData.DataProviders;
        }
    }

    public getDataProviderByID(id: number): any {
        return this.getRefDataByID(this.referenceData.DataProviders, id);
    }

    /**
        * Get list of Data Providers optionally filtered to those in use or by country usage
        */
    public getCheckinStatusTypes(filtered: boolean = false, userSelectable = true): Array<any> {
        let results = null;

        if (filtered == true) {
            results = this.filteredReferenceData.CheckinStatusTypes;
        } else {
            results = this.referenceData.CheckinStatusTypes;
        }

        if (userSelectable) {
            results = results.filter(c => c.IsAutomatedCheckin === false);
        }

        return results;
    }

    public getCheckinStatusTypeByID(id: number): any {
        return this.getRefDataByID(this.referenceData.CheckinStatusTypes, id);
    }

    /**
    * Get list optionally filtered to those in use or by country usage
    */
    public getCommentTypes(filtered: boolean = false, userSelectable: boolean = true): Array<any> {
        let results;

        if (filtered == true) {
            results = this.filteredReferenceData.UserCommentTypes;
        } else {
            results = this.referenceData.UserCommentTypes;
        }

        if (userSelectable) {
            results = results.filter(c => c.ID !== 100 && c.ID !== 110);
        }

        return results;
    }

    public getCommentTypeByID(id: number): any {
        return this.getRefDataByID(this.referenceData.UserCommentTypes, id);
    }

    /**
     * Get list optionally filtered to those in use or by country usage
     */
    public getSubmissionStatusTypes(filtered: boolean = false): Array<any> {
        if (filtered == true) {
            return this.filteredReferenceData.SubmissionStatusTypes;
        } else {
            return this.referenceData.SubmissionStatusTypes;
        }
    }

    public getSubmissionStatusTypesByID(id: number): any {
        return this.getRefDataByID(this.referenceData.SubmissionStatusTypes, id);
    }

    /**
   * Get list optionally filtered to those in use or by country usage
   */
    public getChargingLevelTypes(filtered: boolean = false): Array<any> {
        if (filtered == true) {
            return this.filteredReferenceData.ChargerTypes;
        } else {
            return this.referenceData.ChargerTypes;
        }
    }

    public getChargingLevelTypeByID(id: number): any {
        return this.getRefDataByID(this.referenceData.ChargerTypes, id);
    }

    /**
  * Get list optionally filtered to those in use or by country usage
  */
    public getOutputCurrentTypes(filtered: boolean = false): Array<any> {
        if (filtered) {
            return this.referenceData.CurrentTypes;
        } else {
            return this.filteredReferenceData.CurrentTypes;
        }
    }

    public getOutputCurrentTypeByID(id: number): any {
        return this.getRefDataByID(this.referenceData.CurrentTypes, id);
    }
    //////////////////////

    private loadCachedRefData() {
        const cachedRefData = localStorage.getItem('referenceData');

        // if no cached data available, use local copy
        if (cachedRefData == null) {

            this.http.get<CoreReferenceData>('./assets/data/CoreReferenceData.json').subscribe(res => {
                this.logging.log('Using bundled reference data as cached ref data.');
                this.setCoreReferenceData(res);
                this.setFilteredReferenceData(res);


            });
        } else {
            let res = JSON.parse(cachedRefData);
            this.setCoreReferenceData(res);
        }

        this.setFilteredReferenceData(this.referenceData);

    }

    private cacheCurrentRefData() {
        if (this.referenceData != null) {
            this.referenceData.CacheDate = new Date();
            localStorage.setItem('referenceData', JSON.stringify(this.referenceData));
        }
    }

    public getRefDataByID(refDataList, id) {
        if (id !== '') {
            id = parseInt(id, 10);
        }

        if (refDataList != null) {
            for (let i = 0; i < refDataList.length; i++) {
                if (refDataList[i].ID === id) {
                    return refDataList[i];
                }
            }
        }
        return null;
    }

    private sortCoreReferenceData() {
        // sort reference data lists by Title
        this.sortReferenceData(this.referenceData.ConnectionTypes);
        this.sortReferenceData(this.referenceData.Countries);
        this.sortReferenceData(this.referenceData.Operators);
        this.sortReferenceData(this.referenceData.DataProviders);
        this.sortReferenceData(this.referenceData.UsageTypes);
        this.sortReferenceData(this.referenceData.StatusTypes);
        this.sortReferenceData(this.referenceData.CheckinStatusTypes);
        this.sortReferenceData(this.referenceData.SubmissionStatusTypes);
    }

    private sortReferenceData(sourceList) {
        sourceList.sort(this.sortListByTitle);
    }

    private sortListByTitle(a, b) {
        if (a.Title < b.Title) {
            return -1;
        }
        if (a.Title > b.Title) {
            return 1;
        }

        return 0;
    }

    public getMetadataValueByMetadataFieldID(metadataValues, id) {
        if (id !== '') {
            id = parseInt(id, 10);
        }

        if (metadataValues != null) {
            for (let i = 0; i < metadataValues.length; i++) {
                if (metadataValues[i].ID === id) {
                    return metadataValues[i];
                }
            }
        }
        return null;
    }


    hydrateCompactPOI(poi: any): Array<any> {

        const refData = this;

        if (poi.DataProviderID != null && poi.DataProvider == null) {
            poi.DataProvider = refData.getDataProviderByID(poi.DataProviderID);
        }

        if (poi.OperatorID != null && poi.OperatorInfo == null) {
            poi.OperatorInfo = refData.getNetworkOperatorByID(poi.OperatorID);
        }

        if (poi.UsageTypeID != null && poi.UsageType == null) {
            poi.UsageType = refData.getUsageTypeByID(poi.UsageTypeID);
        }

        if (poi.AddressInfo.CountryID != null && poi.AddressInfo.Country == null) {
            poi.AddressInfo.Country = refData.getCountryByID(poi.AddressInfo.CountryID);
        }

        if (poi.StatusTypeID != null && poi.StatusType == null) {
            poi.StatusType = refData.getStatusTypeByID(poi.StatusTypeID);
        }

        if (poi.SubmissionStatusTypeID != null && poi.SubmissionStatusType == null) {
            poi.SubmissionStatusType = refData.getSubmissionStatusTypesByID(poi.SubmissionStatusTypeID);
        }

        // TODO:  MediaItems,
        if (poi.Connections != null) {
            for (let c = 0; c < poi.Connections.length; c++) {
                const conn = poi.Connections[c];
                if (conn.ConnectionTypeID != null && conn.ConnectionType == null) {
                    conn.ConnectionType = refData.getConnectionTypeByID(conn.ConnectionTypeID);
                }
                if (conn.LevelID != null && conn.Level == null) {
                    conn.Level = refData.getChargingLevelTypeByID(conn.LevelID);
                }
                if (conn.CurrentTypeID != null && conn.CurrentType == null) {
                    conn.CurrentType = refData.getOutputCurrentTypeByID(conn.CurrentTypeID);
                }
                if (conn.StatusTypeID != null && conn.StatusType == null) {
                    conn.StatusTypeID = refData.getStatusTypeByID(conn.StatusTypeID);
                }

                poi.Connections[c] = conn;
            }
        }

        if (poi.UserComments != null) {
            for (let c = 0; c < poi.UserComments.length; c++) {
                const comment = poi.UserComments[c];
                if (comment.CommentType != null && comment.CommentTypeID == null) {
                    comment.CommentType = refData.getCommentTypeByID(comment.CommentTypeID);
                }
                if (comment.CheckinStatusType != null && comment.CheckinStatusTypeID == null) {
                    comment.CheckinStatusTypeID = refData.getCheckinStatusTypeByID(comment.CheckinStatusTypeID);
                }
                poi.UserComments[c] = comment;
            }
        }

        return poi;
    }

    // for a given list of POIs expand navigation properties (such as AddresssInfo.Country, Connection[0].ConnectionType etc)
    hydrateCompactPOIList(poiList: Array<any>) {
        for (let i = 0; i < poiList.length; i++) {
            poiList[i] = this.hydrateCompactPOI(poiList[i]);
        }
        return poiList;
    }
}
